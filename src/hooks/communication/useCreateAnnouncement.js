import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import toast from "react-hot-toast";

import { AnnouncementsAPI } from "../../utils/api";

export default function useCreateAnnouncement() {
  const queryClient =
    useQueryClient();

  const mutation = useMutation({
    mutationFn: ({
      departmentId,
      ...payload
    }) =>
      departmentId != null
        ? AnnouncementsAPI.createDepartment(
            departmentId,
            payload
          )
        : AnnouncementsAPI.createChurch(
            payload
          ),

    onSuccess: (_, variables) => {
      toast.success(
        "Announcement published"
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
          "Failed to publish announcement"
      );
    },
  });

  return {
    createAnnouncement:
      mutation.mutateAsync,

    loading:
      mutation.isPending,

    error: mutation.error,

    reset: mutation.reset,
  };
}