import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "../../components/ToastProvider";
import { MessagesAPI } from "../../utils/api";

export default function useMarkConversationAsRead() {
  const { showToast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (threadId) => MessagesAPI.markAsRead(threadId),

    onSuccess: (_, threadId) => {
      queryClient.invalidateQueries({
        queryKey: ["messages", "conversation", threadId],
      });
      queryClient.invalidateQueries({
        queryKey: ["messages", "unread"],
      });
    },

    onError: (error) => {
      console.error(error);
      showToast(
        error?.message ?? "Failed to mark conversation as read.",
        { type: "error" }
      );
    },
  });
}
