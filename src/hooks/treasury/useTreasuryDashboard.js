import { useQuery } from "@tanstack/react-query";

import { TreasuryAPI } from "../../utils/api";

export function useTreasuryDashboard(
  params = {}
) {
  const query = useQuery({
    queryKey: [
      "treasury-dashboard",
      params,
    ],

    queryFn: async () => {
      const data =
        await TreasuryAPI.overview(params);

      return {
        overview:
          data ?? null,
      };
    },

    staleTime:
      5 * 60 * 1000,
  });

  return {
    /* =========================
       DATA
    ========================== */

    data:
      query.data ?? {
        overview: null,
      },

    /* =========================
       QUERY STATE
    ========================== */

    loading:
      query.isLoading,

    isFetching:
      query.isFetching,

    isRefetching:
      query.isRefetching,

    isError:
      query.isError,

    error:
      query.error,

    /* =========================
       QUERY ACTION
    ========================== */

    refresh:
      query.refetch,
  };
}