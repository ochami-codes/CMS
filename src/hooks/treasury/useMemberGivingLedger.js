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
      filters,
    ],

    enabled:
      memberId != null,

    queryFn: () =>
      TreasuryAPI.memberGivingLedger(
        memberId,
        filters
      ),

    staleTime:
      5 * 60 * 1000,
  });

  return {
    /* =========================
       DATA
    ========================== */

    member:
      query.data?.member ??
      null,

    summary:
      query.data?.summary ?? {
        contributions: 0,
        totalGiving: 0,
        totalTithe: 0,
        fundTotals: [],
      },

    transactions:
      query.data?.transactions ??
      [],

    /* =========================
       QUERY STATE
    ========================== */

    loading:
      query.isLoading,

    isFetching:
      query.isFetching,

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