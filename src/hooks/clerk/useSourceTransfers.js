import { useQuery } from "@tanstack/react-query";
import { ClerkAPI } from "../../utils/api";

export function useSourceTransfers() {
  const query = useQuery({
    queryKey: ["clerk", "source-transfers"],
    queryFn: ClerkAPI.getSourceTransfers,
  });

  return {
    transfers: query.data ?? [],

    // Query state
    loading: query.isLoading,
    isError: query.isError,
    error: query.error,

    // Query action
    refetch: query.refetch,
  };
}