import { useMutation, useQueryClient } from "@tanstack/react-query";

import { ClerkAPI } from "../../utils/api";
import { useToast } from "../../components/ToastProvider";

export function useCreateTransfer() {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useMutation({
    mutationFn: ClerkAPI.createTransfer,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["clerk-transfers"],
      });

      queryClient.invalidateQueries({
        queryKey: ["clerk-members"],
      });

      showToast(
        "Transfer request submitted successfully"
      );
    },

    onError: (error) => {
      showToast(
        error?.message ||
          "Failed to submit transfer request.",
       { type: "error" }
      );
    },
  });
}