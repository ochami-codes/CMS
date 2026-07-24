import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AdminMembershipAPI } from "../../utils/api";

const MEMBERSHIP_REQUESTS_KEY = ["admin", "membership-requests"];

export function useMembershipRequests() {
  const queryClient = useQueryClient();

  /* ========================= FETCH REQUESTS ========================= */
  const requestsQuery = useQuery({
    queryKey: MEMBERSHIP_REQUESTS_KEY,
    queryFn: async () => {
      const res = await AdminMembershipAPI.fetchAll();
      return res?.requests ?? [];
    },
  });

  /* ========================= REVIEW REQUEST ========================= */
  const reviewMutation = useMutation({
    mutationFn: async ({ id, action }) => {
      const status = action === "approve" ? "approved" : "rejected";
      return AdminMembershipAPI.review(id, status);
    },
    onSuccess: (_data, { id, action }) => {
      const status = action === "approve" ? "approved" : "rejected";

      // Optimistically update cached requests
      queryClient.setQueryData(MEMBERSHIP_REQUESTS_KEY, (currentRequests = []) =>
        currentRequests.map((request) =>
          request.membership_request_id === id
            ? { ...request, membership_status: status }
            : request
        )
      );

      // Refresh related queries
      queryClient.invalidateQueries({ queryKey: ["members"] });
    },
  });

  return {
    /* Data */
    requests: requestsQuery.data ?? [],

    /* Query state */
    isLoading: requestsQuery.isLoading,
    isFetching: requestsQuery.isFetching,
    error: requestsQuery.error,

    /* Query actions */
    refetch: requestsQuery.refetch,

    /* Mutation */
    reviewRequest: reviewMutation.mutateAsync,
    isReviewing: reviewMutation.isPending,
    reviewVariables: reviewMutation.variables,
    reviewError: reviewMutation.error,
  };
}
