import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import toast from "react-hot-toast";

import { useAuth } from "../../context/AuthContext";
import { AnnouncementsAPI } from "../../utils/api";

export default function useCreateAnnouncement() {
  const { user } = useAuth();

  const queryClient =
    useQueryClient();

  const mutation = useMutation({
    mutationFn: (payload) =>
      AnnouncementsAPI.create({
        ...payload,
        churchId:
          user?.church_id,
      }),

    onSuccess: () => {
      toast.success(
        "Announcement published"
      );

      queryClient.invalidateQueries({
        queryKey: ["announcements"],
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