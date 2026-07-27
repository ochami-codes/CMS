import { useQuery } from "@tanstack/react-query";
import { ClerkAPI } from "../../utils/api";

export function useMembers(params = "") {
  const query = useQuery({
    queryKey: ["clerk", "members", params],
    queryFn: () => ClerkAPI.getMembers(params),
  });

  return {
    members: query.data ?? [],

    // Query state
    loading: query.isLoading,
    isError: query.isError,
    error: query.error,

    // Query action
    refetch: query.refetch,
  };
}