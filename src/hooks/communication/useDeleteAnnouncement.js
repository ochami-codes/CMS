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
    mutationFn: ({
      departmentId,
      announcementId,
    }) =>
      departmentId != null
        ? AnnouncementsAPI.deleteDepartment(
            departmentId,
            announcementId
          )
        : AnnouncementsAPI.deleteChurch(
            announcementId
          ),

    onSuccess: (_, variables) => {
      toast.success(
        "Announcement deleted"
      );

      queryClient.invalidateQueries({
        queryKey: [
          "announcements",
          {
            departmentId:
              variables.departmentId ??
              null,
          },
        ],
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