import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import toast from "react-hot-toast";

import { MembersAPI } from "../../utils/api";

export default function useAddDepartmentMember() {
  const queryClient = useQueryClient();
  const [activeMemberId, setActiveMemberId] = useState(null);

  const mutation = useMutation({
    mutationFn: async ({ departmentId, memberId }) => {
      setActiveMemberId(memberId);
      return MembersAPI.addToDepartment({ departmentId, memberId });
    },

    onSuccess: (_, { departmentId }) => {
      toast.success("Member added to department.");

      queryClient.invalidateQueries({
        queryKey: ["department-members", departmentId],
      });

      setActiveMemberId(null);
    },

    onError: (error) => {
      console.error(error);

      toast.error(error?.message ?? "Failed to add member to department.");
      setActiveMemberId(null);
    },
  });

  return {
    addMember: mutation.mutateAsync,
    addLoading: mutation.isPending,
    activeMemberId,
    isLoadingFor: (memberId) => mutation.isPending && activeMemberId === memberId,
    error: mutation.error,
    reset: mutation.reset,
  };
}
