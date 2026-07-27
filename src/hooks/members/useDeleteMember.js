import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { MembersAPI } from "../../utils/api";

export default function useDeleteMember() {
  const queryClient = useQueryClient();
  const [deletingIds, setDeletingIds] = useState(new Set());

  const mutation = useMutation({
    mutationFn: MembersAPI.remove,

    onMutate: async ({ memberId }) => {
      setDeletingIds((prev) => new Set(prev).add(memberId));
    },

    onSuccess: (_, { departmentId, memberId }) => {
      toast.success("Member removed from department.");

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

      toast.error(error?.message ?? "Failed to remove member from department.");

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
