import { useQuery } from "@tanstack/react-query";
import { MembersAPI } from "../../utils/api";
import { useToast } from "../../components/ToastProvider";

export default function useMembers(options) {
  const { showToast } = useToast();
  const { search = "", enabled = true } = options ?? {};

  /* ======================
     QUERY: MEMBERS
  ====================== */
  const query = useQuery({
    queryKey: ["members", search],
    queryFn: () => MembersAPI.fetchAll({ search }),
    enabled,
    staleTime: 5 * 60 * 1000, // cache for 5 minutes
    select: (data) => ({
      members: data?.members ?? [],
    }),
    onError: (err) => {
      showToast(err.message || "Failed to fetch members", {type:"error"});
    },
  });

  return {
    members: query.data?.members ?? [],

    // Query state
    loading: query.isLoading,
    isFetching: query.isFetching,
    isError: query.isError,
    error: query.error,

    // Query actions
    refresh: query.refetch,
  };
}
