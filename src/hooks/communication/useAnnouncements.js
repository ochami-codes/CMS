import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { AnnouncementsAPI } from "../../utils/api";

export default function useAnnouncements({
  type = "church",
  limit = 20,
  enabled = true,
} = {}) {
  const query = useQuery({
    queryKey: [
      "announcements",
      type,
      limit,
    ],

    queryFn: () => {
      if (type === "departments") {
        return AnnouncementsAPI.fetchMyDepartments(
          limit
        );
      }

      return AnnouncementsAPI.fetchChurch(
        limit
      );
    },

    enabled,

    staleTime: 5 * 60 * 1000,

    select: (data) => ({
      announcements:
        data?.announcements ?? [],
    }),

    onError: (error) => {
      console.error(error);

      toast.error(
        error?.message ??
          "Failed to load announcements"
      );
    },
  });

  return {
    announcements:
      query.data?.announcements ?? [],

    loading:
      query.isPending,

    error:
      query.error,

    refresh:
      query.refetch,

    isFetching:
      query.isFetching,

    isRefetching:
      query.isRefetching,
  };
}
