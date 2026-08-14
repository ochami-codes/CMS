import { useQuery } from "@tanstack/react-query";
import { ClerkAPI } from "../../utils/api";
import { useToast } from "../../components/ToastProvider";

export function useTransferHistory() {
  const { showToast } = useToast();

  /* ======================
     QUERY: TRANSFER HISTORY
  ====================== */
  const query = useQuery({
    queryKey: ["clerk", "transfer-history"],
    queryFn: ClerkAPI.getTransferHistory,
    onError: (err) => {
      showToast(err.message || "Failed to fetch transfer history", {type:"error"});
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
