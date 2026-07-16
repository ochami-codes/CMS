import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { ClerkAPI } from "../../utils/api";

export default function useChildren({
  params = "",
  enabled = true,
} = {}) {
  const query = useQuery({
    queryKey: [
      "children",
      params,
    ],

    queryFn: () =>
      ClerkAPI.getChildren(params),

    enabled,

    staleTime:
      5 * 60 * 1000,

    select: (data) => ({
      children: data ?? [],
    }),

    onError: (error) => {
      console.error(error);

      toast.error(
        error?.message ??
          "Failed to load children"
      );
    },
  });

  return {
    children:
      query.data?.children ?? [],

    loading:
      query.isPending,

    error:
      query.error,

    refresh:
      query.refetch,

    isFetching:
      query.isFetching,

    isRefetching:
      query.isRefetching,
  };
}