import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useToast } from "../../components/ToastProvider";

import { MembersAPI } from "../../utils/api";

export default function useAddDepartmentMember() {
  const {showToast} = useToast();
  const queryClient = useQueryClient();
  const [activeMemberId, setActiveMemberId] = useState(null);

  const mutation = useMutation({
    mutationFn: async ({ departmentId, memberId }) => {
      setActiveMemberId(memberId);
      return MembersAPI.addToDepartment({ departmentId, memberId });
    },

    onSuccess: (_, { departmentId }) => {
      showToast("Member added to department.");

      queryClient.invalidateQueries({
        queryKey: ["department-members", departmentId],
      });

      setActiveMemberId(null);
    },

    onError: (error) => {
      console.error(error);

      showToast(error?.message ?? "Failed to add member to department.", {type:"error"});
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
