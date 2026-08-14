import { useQuery } from "@tanstack/react-query";
import { ClerkAPI } from "../../utils/api";
import { useToast } from "../../components/ToastProvider";

export function useMembers(params = "") {
  const { showToast } = useToast();

  /* ======================
     QUERY: MEMBERS
  ====================== */
  const query = useQuery({
    queryKey: ["clerk", "members", params],
    queryFn: () => ClerkAPI.getMembers(params),
    onError: (err) => {
      showToast(err.message || "Failed to fetch members", "error");
    },
    staleTime: 60 * 1000, // optional: cache for 1 minute
  });

  return {
    members: query.data ?? [],

    // Query state
    loading: query.isLoading,
    isError: query.isError,
    error: query.error,

    // Query actions
    refetch: query.refetch,
  };
}
