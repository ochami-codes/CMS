import { useMutation } from "@tanstack/react-query";
import { TreasuryAPI } from "../../utils/api";

export default function useRemitFunds(options = {}) {
  return useMutation({
    mutationFn: (data) =>
      TreasuryAPI.remitFunds(data),

    ...options,
  });
}