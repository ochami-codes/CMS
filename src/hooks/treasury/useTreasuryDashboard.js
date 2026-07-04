import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { TreasuryAPI } from "../../utils/api";

export function useTreasuryDashboard(params = {}) {
  const query = useQuery({
    queryKey: ["treasury-dashboard", params],

    queryFn: async () => {
      const data =
        await TreasuryAPI.overview(params);

      return {
        overview:  data ?? null,
      };
    },

    staleTime: 5 * 60 * 1000,

    onError: (error) => {
      console.error(error);
      toast.error("Failed to load treasury data");
    },
  });

  return {
    data: query.data ?? {
      overview: null,
    },

    loading: query.isPending,
    error: query.error,

    refresh: query.refetch,

    isFetching: query.isFetching,
    isRefetching: query.isRefetching,
  };
}