import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { ProfileAPI } from "../../utils/api";
import { useToast } from "../../components/ToastProvider";

export default function useProfile() {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const profileQuery = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      return await ProfileAPI.get();
    },
    staleTime: 5 * 60 * 1000,
  });

  const updateMutation = useMutation({
    mutationFn: (updates) =>
      ProfileAPI.updateProfile(updates),

    onSuccess: () => {
      showToast(
        "Profile updated successfully");

      queryClient.invalidateQueries({
        queryKey: ["profile"],
      });
    },

    onError: (err) => {
      showToast(
        err?.message ||
          "Profile update failed",
        "error"
      );
    },
  });

  return {
    profile:
      profileQuery.data?.profile ?? null,

    loading:
      profileQuery.isPending ||
      profileQuery.isFetching,

    error:
      profileQuery.error,
    isError:
      profileQuery.isError,  

    refresh:
      profileQuery.refetch,

    updateProfile:
      updateMutation.mutateAsync,

    updating:
      updateMutation.isPending,
  };
}