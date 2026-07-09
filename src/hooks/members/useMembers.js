import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { MembersAPI } from "../../utils/api";

export default function useMembers(
  options
) {
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

    onError: (error) => {
      console.error(error);

      toast.error(
        error?.message ??
          "Failed to load members"
      );
    },
  });

  return {
    members:
      query.data?.members ?? [],

    loading:
      query.isPending,

    error:
      query.error,

    refresh:
      query.refetch,

    isFetching:
      query.isFetching,
  };
}