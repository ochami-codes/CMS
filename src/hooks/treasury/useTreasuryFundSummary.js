import { useQuery } from "@tanstack/react-query";
import { TreasuryAPI } from "../../utils/api";

const defaultData = {
  summary: {
    overallBalance: 0,
    trustBalance: 0,
    localBalance: 0,
    departmentBalance: 0,
    pendingRemittance: 0,
  },

  trustFunds: [],
  localFunds: [],
  departmentFunds: [],
  unremittedMonths: [],
};

export default function useTreasuryFundsSummary() {
  const query = useQuery({
    queryKey: ["treasury-funds-summary"],
    queryFn: TreasuryAPI.fundsSummary,
    staleTime: 5 * 60 * 1000,
  });

  return {
    ...query,
    ...defaultData,
    ...(query.data ?? {}),
  };
}