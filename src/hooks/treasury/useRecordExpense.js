import { useMutation, useQueryClient } from "@tanstack/react-query";
import { TreasuryAPI } from "../../utils/api";
import { useToast } from "../../components/ToastProvider";

export default function useRecordExpense({
  onSuccess,
} = {}) {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const mutation = useMutation({
    mutationFn: async (form) => {
      return TreasuryAPI.createTransaction({
        type: "OUT",
        fund_id: form.fund_id,
        amount: Number(form.amount),
        payee_name: form.payee_name,
        expense_category: form.expense_category,
        payment_method: form.payment_method,
        date: form.date,
        notes: form.notes,
      });
    },

    onSuccess: (data) => {
      showToast("Expense recorded successfully");

      // Refresh treasury-related data
      queryClient.invalidateQueries({
        queryKey: ["treasury-funds"],
      });

      queryClient.invalidateQueries({
        queryKey: ["treasury-funds-summary"],
      });

      queryClient.invalidateQueries({
        queryKey: ["treasury-dashboard"],
      });

      queryClient.invalidateQueries({
        queryKey: ["treasury-transactions"],
      });

      onSuccess?.(data);
    },

    onError: (error) => {
      showToast(
        error?.message || "Failed to record expense",
        {type:"error"}
      );
    },
  });

  return {
    recordExpense: mutation.mutateAsync,
    isRecording: mutation.isPending,
    error: mutation.error,
    reset: mutation.reset,
  };
}