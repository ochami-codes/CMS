import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { RoleRequestsAPI } from "../../utils/api";

const ROLE_REQUESTS_QUERY_KEY = [
  "admin",
  "role-requests",
];

export function useRoleRequests({
  enabled = true,
} = {}) {
  const queryClient =
    useQueryClient();

  /* ======================
     FETCH ROLE REQUESTS
  ====================== */

  const requestsQuery =
    useQuery({
      queryKey:
        ROLE_REQUESTS_QUERY_KEY,

      queryFn: async () => {
        const requests =
          await RoleRequestsAPI
            .fetchPending();

        return requests || [];
      },

      enabled,

      // Requests are relatively
      // short-lived data.
      staleTime: 30 * 1000,
    });


  /* ======================
     REVIEW ROLE REQUEST
  ====================== */

  const reviewMutation =
    useMutation({
      mutationFn: ({
        requestId,
        action,
      }) =>
        RoleRequestsAPI.reviewRoleRequest(
          requestId,
          action
        ),

      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey:
            ROLE_REQUESTS_QUERY_KEY,
        });
      },
    });


  return {
    requests:
      requestsQuery.data || [],

    isLoading:
      requestsQuery.isLoading,

    isFetching:
      requestsQuery.isFetching,

    error:
      requestsQuery.error,

    refetch:
      requestsQuery.refetch,

    reviewRequest:
      reviewMutation.mutateAsync,

    isReviewing:
      reviewMutation.isPending,

    reviewingRequestId:
      reviewMutation.variables
        ?.requestId,

    reviewingStatus:
      reviewMutation.variables
        ?.status,
  };
}