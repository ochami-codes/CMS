import { useQuery } from "@tanstack/react-query";
import { ClerkAPI } from "../../utils/api";

export function useTransferHistory() {
  const query = useQuery({
    queryKey: ["clerk", "transfer-history"],
    queryFn: ClerkAPI.getTransferHistory,
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