import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { RoleRequestsAPI } from "../../utils/api";
import { useToast } from "../../components/ToastProvider";

export function useMyRoleRequests(userId) {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const queryKey = ["my-role-requests", userId];

  const requestsQuery = useQuery({
    queryKey,
    queryFn: async () => {
      const data = await RoleRequestsAPI.fetchMyRequests();
      return Array.isArray(data) ? data : data?.requests ?? [];
    },
    enabled: !!userId,
    onError: (error) => {
      showToast({
        type: "error",
        message:
          error?.message ||
          "Failed to load role requests. Please try again.",
      });
    },
  });

  const submitMutation = useMutation({
    mutationFn: (role) => RoleRequestsAPI.submit(role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      showToast("Role request submitted successfully!");
    },
    onError: (error) => {
      showToast(
        error?.message || "Failed to request", {type: "error" } );
    },
  });

  return {
    requests: requestsQuery.data ?? [],
    loading: requestsQuery.isLoading,
    refreshing: requestsQuery.isFetching,
    submitRequest: submitMutation.mutateAsync,
    submitting: submitMutation.isPending,
    error: requestsQuery.error || submitMutation.error,
    refetch: requestsQuery.refetch,
  };
}
