import { useMutation, useQueryClient } from "@tanstack/react-query";
import { MessagesAPI } from "../../utils/api";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../components/ToastProvider";

export default function useSendMessage({
  threadId,
  recipient,
  onThreadCreated,
} = {}) {
  const { showToast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const currentProfileId = user?.id;

  const mutation = useMutation({
    mutationFn: async ({
      content,
      threadId: messageThreadId,
    }) => {
      const payload = messageThreadId
        ? {
            content,
            thread_id: messageThreadId,
          }
        : {
            content,
            recipient_profile_id: recipient?.id,
          };

      return MessagesAPI.send(payload);
    },

    onMutate: async ({
      content,
      threadId: messageThreadId,
    }) => {
      const activeThreadId =
        messageThreadId || threadId;

      const tempId = `temp-${Date.now()}`;

      const optimisticMessage = {
        id: tempId,
        content,
        sender_id: currentProfileId,
        sender: {
          full_name: "You",
        },
        is_me: true,
        created_at: new Date().toISOString(),
        delivered: false,
        is_read: false,
      };

      // New conversation: no thread exists yet.
      if (!activeThreadId) {
        return {
          tempId,
          optimisticMessage,
          previousMessages: null,
          activeThreadId: null,
        };
      }

      const queryKey = [
        "messages",
        "conversation",
        activeThreadId,
      ];

      await queryClient.cancelQueries({
        queryKey,
      });

      const previousMessages =
        queryClient.getQueryData(queryKey);

      queryClient.setQueryData(
        queryKey,
        (old = []) => [
          ...old,
          optimisticMessage,
        ]
      );

      return {
        tempId,
        optimisticMessage,
        previousMessages,
        activeThreadId,
      };
    },

    onSuccess: (response, variables, context) => {
      const returnedThreadId =
        response?.threadId;
      if (!context?.activeThreadId) {
        if (!returnedThreadId) {
          return;
        }

        onThreadCreated?.(returnedThreadId);

        queryClient.setQueryData(
          [
            "messages",
            "conversation",
            returnedThreadId,
          ],
          [context.optimisticMessage]
        );

        return;
      }

    },

    onError: (
      error,
      _variables,
      context
    ) => {
      if (
        context?.previousMessages &&
        context?.activeThreadId
      ) {
        queryClient.setQueryData(
          [
            "messages",
            "conversation",
            context.activeThreadId,
          ],
          context.previousMessages
        );
      }

      console.error(
        "Failed to send message:",
        error
      );

      showToast(
        error?.message ??
          "Failed to send message.",
        {
          type: "error",
        }
      );
    },

    onSettled: (
      _data,
      _error,
      variables,
      context
    ) => {
      const activeThreadId =
        context?.activeThreadId ||
        variables?.threadId ||
        threadId;

      if (!activeThreadId) {
        return;
      }

      queryClient.invalidateQueries({
        queryKey: [
          "messages",
          "conversation",
          activeThreadId,
        ],
      });
    },
  });

  return {
    sendMessage: mutation.mutate,
    sendMessageAsync: mutation.mutateAsync,

    isSending: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,

    error: mutation.error,
    data: mutation.data,

    reset: mutation.reset,
  };
}