import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "../../components/ToastProvider";
import { MessagesAPI } from "../../utils/api";

export default function useThreadWithUser() {
  const { showToast } = useToast();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (profileId) =>
      MessagesAPI.getThreadWith(profileId),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["messages", "inbox"],
      });
    },

    onError: (error) => {
      console.error(error);

      showToast(
        error?.message ??
          "Failed to fetch thread with user.",
        { type: "error" }
      );
    },
  });

  return {
    getThreadWithUser: mutation.mutate,
    getThreadWithUserAsync: mutation.mutateAsync,

    isLoadingUser: mutation.isPending,
    isError: mutation.isError,
    isSuccess: mutation.isSuccess,

    error: mutation.error,
    data: mutation.data,

    reset: mutation.reset,
  };
}
