import { useQuery } from "@tanstack/react-query";
import { MembersAPI } from "../../utils/api";

export default function useDepartmentMembers(
  departmentId,
  options,
) {
  const {
    search = "",
    enabled = true,
  } = options ?? {};

  const query = useQuery({
    queryKey: [
      "department-members",
      departmentId,
      search,
    ],

    queryFn: () =>
      MembersAPI.fetchAll({
        departmentId,
        search,
      }),

    enabled:
      enabled && !!departmentId,

    staleTime: 5 * 60 * 1000,

    select: (data) => ({
      members:
        data?.members ?? [],
    }),
  });

  return {
    members:
      query.data?.members ?? [],

    // Query state
    loading:
      query.isLoading,

    isError:
      query.isError,

    error:
      query.error,

    isFetching:
      query.isFetching,

    // Query action
    refresh:
      query.refetch,
  };
}