import { useQuery } from "@tanstack/react-query";

import { TreasuryAPI } from "../../utils/api";

export default function useMemberGivingLedger(
  memberId,
  filters = {}
) {

  const query = useQuery({

    queryKey: [
      "member-giving-ledger",
      memberId,
    ],

    enabled: memberId != null,

    queryFn: async () => {

      const response =
        await TreasuryAPI.memberGivingLedger(
          memberId,
          filters
        );

      return response;

    },

    staleTime:
      5 * 60 * 1000,

  });

  return {

    member:
      query.data?.member ?? null,

    summary:
      query.data?.summary ?? {
        contributions: 0,
        totalGiving: 0,
        totalTithe: 0,
        fundTotals: [],
      },

    transactions:
      query.data?.transactions ?? [],

    loading:
      query.isLoading ||
      query.isFetching,

    error:
      query.error,

    refresh:
      query.refetch,

  };

}