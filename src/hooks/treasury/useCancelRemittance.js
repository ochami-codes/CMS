import { useMutation } from "@tanstack/react-query";
import { TreasuryAPI } from "../../utils/api";
import { useToast } from "../../components/ToastProvider";

export default function useCancelRemittance(options = {}) {
  const { showToast } = useToast();

  /* ======================
     CANCEL REMITTANCE MUTATION
  ====================== */
  return useMutation({
    mutationFn: (remittanceId) => TreasuryAPI.cancelRemittance(remittanceId),
    onSuccess: () => {
      showToast("Remittance cancelled successfully", "success");
    },
    onError: (error) => {
      showToast(error.message || "Failed to cancel remittance", "error");
    },
    ...options,
  });
}
