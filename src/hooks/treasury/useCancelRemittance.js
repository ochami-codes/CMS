import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { TreasuryAPI } from "../../utils/api";

export default function useCancelRemittance() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: remittanceId =>
      TreasuryAPI.cancelRemittance(
        remittanceId
      ),

    onSuccess: () => {
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
  });
}