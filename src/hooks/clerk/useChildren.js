import { useQuery } from "@tanstack/react-query";
import { useToast } from "../../components/ToastProvider";

import { ClerkAPI } from "../../utils/api";

export default function useChildren({
  params = "",
  enabled = true,
} = {}) {
  const {showToast} = useToast();
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

      showToast(
        error?.message ??
          "Failed to load children", {type: "error"}
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

    isError:
       query.isError,  

    refresh:
      query.refetch,

    isFetching:
      query.isFetching,

    isRefetching:
      query.isRefetching,
  };
}