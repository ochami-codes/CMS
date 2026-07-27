import { useQuery } from "@tanstack/react-query";

import { TreasuryAPI } from "../../utils/api";
import useRemitFunds from "./useRemit";
import useCancelRemittance from "./useCancelRemittance";

export default function useRemittances() {
  const query = useQuery({
    queryKey: [
      "treasury-remittances",
    ],

    queryFn: () =>
      TreasuryAPI.remittances(),

    staleTime:
      5 * 60 * 1000,
  });

  const remit =
    useRemitFunds();

  const cancel =
    useCancelRemittance();

  return {
    /* =========================
       DATA
    ========================== */

    remittances:
      query.data ?? [],

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

    /* =========================
       REMIT MUTATION
    ========================== */

    remit,

    /* =========================
       CANCEL MUTATION
    ========================== */

    cancel,
  };
}