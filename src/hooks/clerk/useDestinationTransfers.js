import { useQuery } from "@tanstack/react-query";
import { ClerkAPI } from "../../utils/api";
import { useToast } from "../../components/ToastProvider";

export function useDestinationTransfers() {
  const { showToast } = useToast();

  /* ======================
     QUERY: DESTINATION TRANSFERS
  ====================== */
  const query = useQuery({
    queryKey: ["clerk", "destination-transfers"],
    queryFn: ClerkAPI.getDestinationTransfers,
    onError: (err) => {
      showToast(err.message || "Failed to fetch destination transfers", {type:"error"});
    },
    staleTime: 60 * 1000, // optional: cache for 1 minute
  });

  return {
    transfers: query.data ?? [],

    // Query state
    loading: query.isLoading,
    isError: query.isError,
    error: query.error,

    // Query actions
    refetch: query.refetch,
  };
}
