import { useQuery } from "@tanstack/react-query";

import { TreasuryAPI } from "../../utils/api";
import useRemitFunds from "./useRemit";
import useCancelRemittance from "./useCancelRemittance";

export default function useRemittances() {
  const query = useQuery({
    queryKey: ["treasury-remittances"],

    queryFn: () =>
      TreasuryAPI.remittances(),

    staleTime: 5 * 60 * 1000,
  });

  return {
    ...query,

    remittances:
      query.data ?? [],

    remit:
      useRemitFunds(),

    cancel:
      useCancelRemittance(),
  };
}