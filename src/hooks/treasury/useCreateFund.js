import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { TreasuryAPI } from "../../utils/api";

export default function useCreateFund() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (payload) =>
      TreasuryAPI.createFund(payload),

    onSuccess: () => {
      toast.success(
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
      console.error(
        "Create fund:",
        error
      );

      toast.error(
        error?.message ??
          "Failed to create fund."
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