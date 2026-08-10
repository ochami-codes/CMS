import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { useToast } from "../../components/ToastProvider";

import { AnnouncementsAPI } from "../../utils/api";

export default function useCreateDepartmentAnnouncement() {
  const { showToast } = useToast();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({
      departmentId,
      ...payload
    }) =>
      AnnouncementsAPI.createDepartment(
        departmentId,
        payload
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

      showToast("Announcement published");
    },

    onError: (error) => {
      console.error(error);

      showToast(
        error?.message ??
          "Failed to publish announcement",
        { type: "error" }
      );
    },
  });

  return {
    createDepartmentAnnouncement:
      mutation.mutateAsync,

    loading: mutation.isPending,

    error: mutation.error,

    reset: mutation.reset,
  };
}