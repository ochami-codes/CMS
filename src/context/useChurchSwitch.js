import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { ChurchAPI } from "../utils/api";

export function useChurchSwitch() {
  const queryClient = useQueryClient();

  const switchChurchMutation = useMutation({
    mutationFn: (churchId) =>
      ChurchAPI.setActiveChurch({
        church_id: churchId,
      }),

    onSuccess: async () => {
      await queryClient.refetchQueries({
        queryKey: ["me"],
      });
    },
  });

  return {
    switchChurch: switchChurchMutation.mutateAsync,

    isSwitchingChurch:
      switchChurchMutation.isPending,

    switchChurchError:
      switchChurchMutation.error?.message ?? null,

    switchChurchSuccess:
      switchChurchMutation.isSuccess,

    resetSwitchChurch:
      switchChurchMutation.reset,
  };
}
