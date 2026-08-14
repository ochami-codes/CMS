import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "../../components/ToastProvider";

import { ClerkAPI } from "../../utils/api";

export default function useAddMember() {
  const queryClient = useQueryClient();
  const {showToast} = useToast();
  const mutation = useMutation({
    mutationFn: ClerkAPI.addMember,

    onSuccess: () => {
      showToast("Member added");

      queryClient.invalidateQueries({
        queryKey: ["clerk-members"],
      });
    },

    onError: (error) => {
      console.error(error);

      showToast(
        error?.message ??
          "Failed adding member", {type: "error"}
      );
    },
  });

  return {
    ...mutation,

    addMember: mutation.mutateAsync,
    loading: mutation.isPending,
  };
}