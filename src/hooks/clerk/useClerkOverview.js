// hooks/clerk/useClerkOverview.js

import { useQuery } from "@tanstack/react-query";
import { ClerkAPI } from "../../utils/api";
import { useToast } from "../../components/ToastProvider";

export function useClerkOverview() {
  const { showToast } = useToast();

  /* ======================
     QUERY: CLERK OVERVIEW
  ====================== */
  const query = useQuery({
    queryKey: ["clerk", "overview"],
    queryFn: ClerkAPI.overview,
    onError: (err) => {
      showToast(err.message || "Failed to fetch clerk overview", {type:"error"});
    },
    staleTime: 60 * 1000, // optional: cache for 1 minute
  });

  return {
    data: query.data ?? null,

    // Query state
    loading: query.isLoading,
    isError: query.isError,
    error: query.error,

    // Query actions
    refetch: query.refetch,
  };
}
