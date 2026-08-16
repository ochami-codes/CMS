import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "../../components/ToastProvider";
import { MessagesAPI } from "../../utils/api";

export default function useMarkThreadAsRead() {
  const { showToast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (threadId) => MessagesAPI.markAsRead(threadId),

    onSuccess: (_, threadId) => {
      // Update inbox cache immediately
      queryClient.setQueryData(["messages", "inbox"], (inbox = []) =>
        inbox.map((thread) =>
          thread.thread_id === threadId
            ? { ...thread, unread_count: 0 }
            : thread
        )
      );

      // Invalidate related queries
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
        error?.message ?? "Failed to mark thread as read.",
        { type: "error" }
      );
    },
  });
}
