import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { RoleRequestsAPI } from "../../utils/api";

export function useMyRoleRequests(userId) {
  const queryClient = useQueryClient();

  const queryKey = [
    "my-role-requests",
    userId,
  ];

  const requestsQuery = useQuery({
    queryKey,
    queryFn: async () => {
      const data =
        await RoleRequestsAPI.fetchMyRequests();

      return Array.isArray(data)
        ? data
        : data?.requests ?? [];
    },
    enabled: !!userId,
  });

  const submitMutation = useMutation({
    mutationFn: (role) =>
      RoleRequestsAPI.submit(role),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey,
      });
    },
  });

  return {
    requests: requestsQuery.data ?? [],
    loading: requestsQuery.isLoading,
    refreshing: requestsQuery.isFetching,

    submitRequest:
      submitMutation.mutateAsync,

    submitting:
      submitMutation.isPending,

    error:
      requestsQuery.error ||
      submitMutation.error,

    refetch: requestsQuery.refetch,
  };
}