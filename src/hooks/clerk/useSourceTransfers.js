import { useQuery } from "@tanstack/react-query";
import { ClerkAPI } from "../../utils/api";
import { useToast } from "../../components/ToastProvider";

export function useSourceTransfers() {
  const { showToast } = useToast();

  /* ======================
     QUERY: SOURCE TRANSFERS
  ====================== */
  const query = useQuery({
    queryKey: ["clerk", "source-transfers"],
    queryFn: ClerkAPI.getSourceTransfers,
    onError: (err) => {
      showToast(err.message || "Failed to fetch source transfers", {type:"error"});
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
