import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "../../components/ToastProvider";
import { RoleRequestsAPI } from "../../utils/api";

const ROLE_REQUESTS_QUERY_KEY = ["admin", "role-requests"];

export function useRoleRequests({ enabled } = {}) {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  /* ======================
     FETCH ROLE REQUESTS
  ====================== */
  const requestsQuery = useQuery({
    queryKey: ROLE_REQUESTS_QUERY_KEY,
    queryFn: async () => {
      const requests = await RoleRequestsAPI.fetchPending();
      return requests || [];
    },
    enabled,
    staleTime: 30 * 1000,
  });

  /* ======================
     REVIEW ROLE REQUEST
  ====================== */
  const reviewMutation = useMutation({
    mutationFn: ({ requestId, action }) =>
      RoleRequestsAPI.reviewRoleRequest(requestId, action),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ROLE_REQUESTS_QUERY_KEY });
      showToast("Role request reviewed successfully");
    },
    onError: (error) => {
      showToast(error.message || "Failed to review role request", {type:"error"});
    },
  });

  /* ======================
     MUTATION STATE
  ====================== */
  const reviewingRequestId = reviewMutation.variables?.requestId;
  const reviewingAction = reviewMutation.variables?.action;
  const isApproving =
    reviewMutation.isPending && reviewingAction === "approved";
  const isRejecting =
    reviewMutation.isPending && reviewingAction === "rejected";

  return {
    /* ======================
       QUERY
    ====================== */
    requests: requestsQuery.data || [],
    isLoading: requestsQuery.isLoading,
    isFetching: requestsQuery.isFetching,
    error: requestsQuery.error,
    isError: requestsQuery.isError,
    refetch: requestsQuery.refetch,

    /* ======================
       MUTATION
    ====================== */
    reviewRequest: reviewMutation.mutateAsync,
    isReviewing: reviewMutation.isPending,
    isApproving,
    isRejecting,
    reviewingRequestId,
    reviewingAction,
    reviewError: reviewMutation.error,
  };
}
