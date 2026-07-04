import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { TreasuryAPI } from "../../utils/api";

export default function useRemitFunds() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn:
      TreasuryAPI.remitFunds,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [
          "treasury-funds-summary",
        ],
      });
    },
  });
}