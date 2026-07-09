import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import toast from "react-hot-toast";

import { MembersAPI } from "../../utils/api";

export default function useDeleteMember() {
  const queryClient =
    useQueryClient();

  const mutation = useMutation({
    mutationFn:
      MembersAPI.remove,

    onSuccess: (
      _,
      { departmentId }
    ) => {
      toast.success(
        "Member removed from department."
      );

      queryClient.invalidateQueries({
        queryKey: [
          "department-members",
          departmentId,
        ],
      });
    },

    onError: (error) => {
      console.error(error);

      toast.error(
        error?.message ??
          "Failed to remove member from department."
      );
    },
  });

  return {
    deleteMember:
      mutation.mutateAsync,

    loading:
      mutation.isPending,

    error:
      mutation.error,

    reset:
      mutation.reset,
  };
}