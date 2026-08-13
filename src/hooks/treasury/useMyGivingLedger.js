import { useQuery } from "@tanstack/react-query";
import { TreasuryAPI } from "../../utils/api";

export default function useMyGivingLedger({
  filters = {},
  enabled = true,
} = {}) {
  const {
    data,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: [
      "my-giving-ledger",
      filters,
    ],

    queryFn: () =>
      TreasuryAPI.myGivingLedger(filters),

    enabled,

    staleTime:
      5 * 60 * 1000,
  });

  return {
    // Data
    member:
      data?.member ?? null,

    summary:
      data?.summary ?? {
        contributions: 0,
        totalGiving: 0,
        totalTithe: 0,
        fundTotals: [],
      },

    transactions:
      data?.transactions ?? [],

    // Query state
    loading:
      isLoading,

    isFetching,

    isError,

    error,

    // Query action
    refresh:
      refetch,
  };
}