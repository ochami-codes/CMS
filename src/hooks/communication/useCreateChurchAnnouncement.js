import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { useToast } from "../../components/ToastProvider";

import { AnnouncementsAPI } from "../../utils/api";

export default function useCreateChurchAnnouncement() {
  const { showToast } = useToast();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (payload) =>
      AnnouncementsAPI.createChurch(payload),

onSuccess: async () => {
  console.log(
    "CREATE SUCCESS"
  );

  console.log(
    "MATCHING QUERIES:",
    queryClient.getQueriesData({
      queryKey: [
        "announcements",
        "church",
      ],
    })
  );

  await queryClient.refetchQueries({
    queryKey: [
      "announcements",
      "church",
    ],
    type: "active",
  });

  showToast("Announcement published");
},
  });

  return {
    createChurchAnnouncement:
      mutation.mutateAsync,

    loading: mutation.isPending,

    error: mutation.error,

    reset: mutation.reset,
  };
}