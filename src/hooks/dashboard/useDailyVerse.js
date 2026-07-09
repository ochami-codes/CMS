import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { getDailyVerse } from "../../utils/api";

export default function useDailyVerse({
  enabled = true,
} = {}) {
  const query = useQuery({
    queryKey: ["daily-verse"],

    queryFn: getDailyVerse,

    enabled,

    staleTime: 24 * 60 * 60 * 1000, // 24 hours

    gcTime: 24 * 60 * 60 * 1000,

    onError: (error) => {
      console.error(error);

      toast.error(
        error?.message ??
          "Failed to load today's verse"
      );
    },
  });

  return {
    verse: query.data ?? null,

    loading: query.isPending,

    error: query.error,

    refresh: query.refetch,

    isFetching: query.isFetching,

    isRefetching:
      query.isRefetching,
  };
}