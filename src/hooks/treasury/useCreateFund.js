import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "../../components/ToastProvider";

import { TreasuryAPI } from "../../utils/api";

export default function useCreateFund() {
  const {showToast} = useToast();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (payload) =>
      TreasuryAPI.createFund(payload),

    onSuccess: () => {
      showToast(
        "Fund created successfully."
      );

      // Refresh treasury funds after creating a fund
      queryClient.invalidateQueries({
        queryKey: ["treasury-funds"],
      });

      // Refresh funds summary if displayed elsewhere
      queryClient.invalidateQueries({
        queryKey: ["treasury-funds-summary"],
      });
    },

    onError: (error) => {

      showToast(
        error?.message ??
          "Failed to create fund.", {type:"error"}
      );
    },
  });

  return {
    createFund:
      mutation.mutateAsync,

    creating:
      mutation.isPending,

    isError:
      mutation.isError,

    error:
      mutation.error,

    reset:
      mutation.reset,
  };
}