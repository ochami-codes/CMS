import { useMutation } from "@tanstack/react-query";

import { TreasuryAPI } from "../../utils/api";

export default function useCancelRemittance(
  options = {}
) {
  return useMutation({
    mutationFn: (remittanceId) =>
      TreasuryAPI.cancelRemittance(
        remittanceId
      ),

    ...options,
  });
}