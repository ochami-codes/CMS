import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { useToast } from "../../components/ToastProvider";

import { AnnouncementsAPI } from "../../utils/api";

export default function useDeleteChurchAnnouncement() {
  const { showToast } = useToast();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (announcementId) =>
      AnnouncementsAPI.deleteChurch(
        announcementId
      ),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [
          "announcements",
          "church",
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
    deleteChurchAnnouncement:
      mutation.mutateAsync,

    loading: mutation.isPending,

    error: mutation.error,

    reset: mutation.reset,
  };
}