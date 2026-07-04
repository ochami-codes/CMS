import { useQuery } from "@tanstack/react-query";
import { TreasuryAPI } from "../../utils/api";

export default function useTreasuryFunds(
  filters = {}
) {
  const query = useQuery({
    queryKey: [
      "treasury-funds",
      filters,
    ],

    queryFn: () =>
      TreasuryAPI.funds(filters),

    staleTime:
      5 * 60 * 1000,
  });

  return {
    ...query,
    funds: query.data ?? [],
  };
}