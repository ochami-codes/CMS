import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "../../components/ToastProvider";
import { AnnouncementsAPI } from "../../utils/api";

export default function useCreateChurchAnnouncement() {
  const { showToast } = useToast();
  const queryClient = useQueryClient();

  /* ======================
     CREATE CHURCH ANNOUNCEMENT
  ====================== */
  const mutation = useMutation({
    mutationFn: (payload) => AnnouncementsAPI.createChurch(payload),
    onSuccess: async () => {
      // Refresh announcements after successful creation
      await queryClient.refetchQueries({
        queryKey: ["announcements", "church"],
        type: "active",
      });
      showToast("Announcement published");
    },
    onError: (error) => {
      showToast(error.message || "Failed to publish announcement", {type:"error"});
    },
  });

  return {
    createChurchAnnouncement: mutation.mutateAsync,
    loading: mutation.isPending,
    error: mutation.error,
    reset: mutation.reset,
  };
}
