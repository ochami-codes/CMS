import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import toast from "react-hot-toast";

import { MembersAPI } from "../../utils/api";

export default function useAddDepartmentMember() {
  const queryClient =
    useQueryClient();

  const mutation = useMutation({
    mutationFn: MembersAPI.addToDepartment,

    onSuccess: (
      _,
      { departmentId }
    ) => {
      toast.success(
        "Member added to department."
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
          "Failed to add member to department."
      );
    },
  });

  return {
    addMember:
      mutation.mutateAsync,

    loading:
      mutation.isPending,

    error:
      mutation.error,

    reset:
      mutation.reset,
  };
}