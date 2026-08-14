import { useMutation } from "@tanstack/react-query";
import { useToast } from "../../components/ToastProvider";

import { TreasuryAPI } from "../../utils/api";

export default function useCreateTransaction() {
  const {showToast} = useToast();
  const mutation = useMutation({
    mutationFn: TreasuryAPI.createTransaction,

    onSuccess: () => {
      showToast("Funds recorded successfully");
    },

    onError: (error) => {
      console.error("Create transaction:", error);

      showToast(
        error?.message ??
          "Failed recording funds", {type:"error"}
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