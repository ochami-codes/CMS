import { useQuery } from "@tanstack/react-query";
import { MembersAPI } from "../../utils/api";

export default function useMembers(options) {
  const {
    search = "",
    enabled = true,
  } = options ?? {};

  const query = useQuery({
    queryKey: [
      "members",
      search,
    ],

    queryFn: () =>
      MembersAPI.fetchAll({
        search,
      }),

    enabled,

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