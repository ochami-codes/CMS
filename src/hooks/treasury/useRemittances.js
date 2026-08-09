import { useQuery, useQueryClient } from "@tanstack/react-query";

import { TreasuryAPI } from "../../utils/api";
import useRemitFunds from "./useRemit";
import useCancelRemittance from "./useCancelRemittance";
import { useToast } from "../../components/ToastProvider";

const REMITTANCES_QUERY_KEY = [
  "treasury-remittances",
];

export default function useRemittances() {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  /* =========================
     FETCH REMITTANCES
  ========================== */

  const query = useQuery({
    queryKey: REMITTANCES_QUERY_KEY,

    queryFn: () =>
      TreasuryAPI.remittances(),

    staleTime:
      5 * 60 * 1000,
  });

  /* =========================
     REMIT MUTATION
  ========================== */

  const remitMutation =
    useRemitFunds({
      onSuccess: () => {
        showToast(
          "Funds remitted successfully",
          "success"
        );

        queryClient.invalidateQueries({
          queryKey:
            [ "treasury-funds-summary"],
        });
      },

      onError: (error) => {
        showToast(
          error?.message ||
            "Failed to remit funds",
          "error"
        );
      },
    });

  /* =========================
     CANCEL MUTATION
  ========================== */
const cancelMutation =
  useCancelRemittance({
    onSuccess: () => {
      showToast(
        "Remittance cancelled successfully",
        "success"
      );

      queryClient.invalidateQueries({
        queryKey: [
          "treasury-funds-summary",
        ],
      });

      queryClient.invalidateQueries({
        queryKey: [
          "treasury-remittances",
        ],
      });

      queryClient.invalidateQueries({
        queryKey: [
          "treasury-transactions",
        ],
      });
    },

    onError: (error) => {
      showToast(
        error?.message ||
          "Failed to cancel remittance",
        "error"
      );
    },
  });

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
       QUERY ACTIONS
    ========================== */

    refresh:
      query.refetch,

    /* =========================
       REMIT ACTION
    ========================== */

    remitFunds:
      remitMutation.mutateAsync,

    isRemitting:
      remitMutation.isPending,

    remitError:
      remitMutation.error,

    /* =========================
       CANCEL ACTION
    ========================== */

    cancelRemittance:
      cancelMutation.mutateAsync,

    isCancelling:
      cancelMutation.isPending,

    cancelError:
      cancelMutation.error,
  };
}