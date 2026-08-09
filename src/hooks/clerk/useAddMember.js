import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { ClerkAPI } from "../../utils/api";

export default function useAddMember() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ClerkAPI.addMember,

    onSuccess: () => {
      toast.success("Member added");

      queryClient.invalidateQueries({
        queryKey: ["clerk-members"],
      });
    },

    onError: (error) => {
      console.error(error);

      toast.error(
        error?.message ??
          "Failed adding member"
      );
    },
  });

  return {
    ...mutation,

    addMember: mutation.mutateAsync,
    loading: mutation.isPending,
  };
}