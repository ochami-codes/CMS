import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { TreasuryAPI } from "../../utils/api";

export default function useCreateTransaction() {
  const mutation = useMutation({
    mutationFn: TreasuryAPI.createTransaction,

    onSuccess: () => {
      toast.success("Funds recorded successfully");
    },

    onError: (error) => {
      console.error("Create transaction:", error);

      toast.error(
        error?.message ??
          "Failed recording funds"
      );
    },
  });

  return {
    createTransaction:
      mutation.mutateAsync,

    saving:
      mutation.isPending,

    isError:
      mutation.isError,

    error:
      mutation.error,

    reset:
      mutation.reset,
  };
}