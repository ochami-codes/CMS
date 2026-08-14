import { useQuery } from "@tanstack/react-query";
import { useToast } from "../../components/ToastProvider";

import { getDailyVerse } from "../../utils/api";

export default function useDailyVerse({
  enabled = true,
} = {}) {
  const {showToast} = useToast();
  const query = useQuery({
    queryKey: ["daily-verse"],

    queryFn: getDailyVerse,

    enabled,

    staleTime: 24 * 60 * 60 * 1000, // 24 hours

    gcTime: 24 * 60 * 60 * 1000,

    onError: (error) => {
      console.error(error);

      showToast(
        error?.message ??
          "Failed to load today's verse",
          {type:"error"}
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