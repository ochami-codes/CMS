// hooks/clerk/useClerkOverview.js

import { useQuery } from "@tanstack/react-query";
import { ClerkAPI } from "../../utils/api";

export function useClerkOverview() {
  const query = useQuery({
    queryKey: ["clerk", "overview"],
    queryFn: ClerkAPI.overview,
  });

  return {
    data: query.data ?? null,

    // Query state
    loading: query.isLoading,
    isError: query.isError,
    error: query.error,

    // Query action
    refetch: query.refetch,
  };
}