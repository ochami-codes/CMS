import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "../../components/ToastProvider";

import { MembersAPI } from "../../utils/api";

export default function useDeleteMember() {
  const {showToast} = useToast();
  const queryClient = useQueryClient();
  const [deletingIds, setDeletingIds] = useState(new Set());

  const mutation = useMutation({
    mutationFn: MembersAPI.remove,

    onMutate: async ({ memberId }) => {
      setDeletingIds((prev) => new Set(prev).add(memberId));
    },

    onSuccess: (_, { departmentId, memberId }) => {
      showToast("Member removed from department.");

      queryClient.invalidateQueries({
        queryKey: ["department-members", departmentId],
      });

      setDeletingIds((prev) => {
        const next = new Set(prev);
        next.delete(memberId);
        return next;
      });
    },

    onError: (error, { memberId }) => {
      console.error(error);

      showToast(error?.message ?? "Failed to remove member from department.", {type:"error"});

      setDeletingIds((prev) => {
        const next = new Set(prev);
        next.delete(memberId);
        return next;
      });
    },
  });

  return {
    deleteMember: mutation.mutateAsync,
    isDeleting: (memberId) => deletingIds.has(memberId), // per-member check
    error: mutation.error,
    reset: mutation.reset,
  };
}
