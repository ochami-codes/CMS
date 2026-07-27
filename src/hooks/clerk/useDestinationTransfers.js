import { useQuery } from "@tanstack/react-query";
import { ClerkAPI } from "../../utils/api";

export function useDestinationTransfers() {
  const query = useQuery({
    queryKey: ["clerk", "destination-transfers"],
    queryFn: ClerkAPI.getDestinationTransfers,
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