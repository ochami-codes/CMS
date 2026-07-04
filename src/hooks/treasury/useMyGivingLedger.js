import { useQuery } from "@tanstack/react-query";

import { TreasuryAPI } from "../../utils/api";

export default function useMyGivingLedger(
  filters = {}
) {

  const {
    data,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useQuery({

    queryKey: [
      "my-giving-ledger",
      filters,
    ],

    queryFn: async () => {
      const response =
        await TreasuryAPI.myGivingLedger(
          filters
        );

      return response;
    },

    staleTime:
      5 * 60 * 1000,

  });

  return {

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

    loading:
      isLoading || isFetching,

    error,

    refresh:
      refetch,

  };

}