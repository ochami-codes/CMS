import { useQuery } from "@tanstack/react-query";
import { useToast } from "../../components/ToastProvider";

import { AnnouncementsAPI } from "../../utils/api";

export default function useChurchAnnouncements({
  limit = 20,
  enabled = true,
} = {}) {
  const { showToast } = useToast();
  const query = useQuery({
    queryKey: [
      "announcements",
      "church",
      limit,
    ],

    queryFn: () =>
      AnnouncementsAPI.fetchChurch(limit),

    enabled,

    staleTime: 5 * 60 * 1000,

    select: (data) => ({
      announcements:
        data?.announcements ?? [],
    }),

    onError: (error) => {
      console.error(error);

      showToast(error?.message || "Failed to fetch announcement", {type: "error"});
    },
  });

  return {
    announcements:
      query.data?.announcements ?? [],

    loading: query.isPending,

    error: query.error,

    isError: query.isError,

    refresh: query.refetch,

    isFetching: query.isFetching,

    isRefetching: query.isRefetching,
  };
}
