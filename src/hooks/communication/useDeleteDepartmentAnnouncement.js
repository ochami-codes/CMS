import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { useToast } from "../../components/ToastProvider";

import { AnnouncementsAPI } from "../../utils/api";

export default function useDeleteDepartmentAnnouncement() {
  const { showToast } = useToast();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({
      departmentId,
      announcementId,
    }) =>
      AnnouncementsAPI.deleteDepartment(
        departmentId,
        announcementId
      ),

    onSuccess: async (_, variables) => {
      await queryClient.invalidateQueries({
        queryKey: [
          "announcements",
          "department",
          variables.departmentId,
        ],
        refetchType: "active",
      });

      showToast("Announcement deleted");
    },

    onError: (error) => {
      console.error(error);

      showToast(
        error?.message ??
          "Failed to delete announcement",
        { type: "error" }
      );
    },
  });

  return {
    deleteDepartmentAnnouncement:
      mutation.mutateAsync,

    loading: mutation.isPending,

    error: mutation.error,

    reset: mutation.reset,
  };
}