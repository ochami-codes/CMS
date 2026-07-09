import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import toast from "react-hot-toast";

import { AnnouncementsAPI } from "../../utils/api";

export default function useDeleteAnnouncement() {

  const queryClient =
    useQueryClient();

  const mutation = useMutation({
    mutationFn:
      AnnouncementsAPI.remove,

    onSuccess: () => {
      toast.success(
        "Announcement deleted"
      );

      queryClient.invalidateQueries({
        queryKey: ["announcements"],
      });
    },

    onError: (error) => {
      console.error(error);

      toast.error(
        error?.message ??
          "Failed to delete announcement"
      );
    },
  });

  return {
    deleteAnnouncement:
      mutation.mutateAsync,

    loading:
      mutation.isPending,

    error: mutation.error,

    reset: mutation.reset,
  };
}