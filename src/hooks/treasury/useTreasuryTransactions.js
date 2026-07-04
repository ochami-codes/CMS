import { useQuery } from "@tanstack/react-query";

import { TreasuryAPI } from "../../utils/api";

const DEFAULT_SUMMARY = {
  today_count: 0,
  today_recorded: 0,
  today_expenses: 0,
};

export default function useTreasuryTransactions({
  start,
  end,
  fundId,
  type,
} = {}) {
  const query = useQuery({
    queryKey: [
      "treasury-transactions",
      {
        start,
        end,
        fundId,
        type,
      },
    ],

    queryFn: () =>
      TreasuryAPI.transactions({
        start,
        end,
        fund_id: fundId,
        type,
      }),

    staleTime: 5 * 60 * 1000,
  });

  return {
    ...query,

    transactions:
      query.data?.transactions ?? [],

    summary:
      query.data?.summary ??
      DEFAULT_SUMMARY,

    loading:
      query.isLoading,
  };
}