import { useQuery } from "@tanstack/react-query";
import { MembersAPI } from "../../utils/api";
import { useToast } from "../../components/ToastProvider";

export default function useDepartmentMembers(departmentId, options) {
  const { showToast } = useToast();
  const { search = "", enabled = true } = options ?? {};

  /* ======================
     QUERY: DEPARTMENT MEMBERS
  ====================== */
  const query = useQuery({
    queryKey: ["department-members", departmentId, search],
    queryFn: () =>
      MembersAPI.fetchAll({
        departmentId,
        search,
      }),
    enabled: enabled && !!departmentId,
    staleTime: 5 * 60 * 1000, // cache for 5 minutes
    select: (data) => ({
      members: data?.members ?? [],
    }),
    onError: (err) => {
      showToast(err.message || "Failed to fetch department members", {type:"error"});
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
