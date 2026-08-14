import { useQuery } from "@tanstack/react-query";
import { useToast } from "../../components/ToastProvider";

import { MembershipAPI } from "../../utils/api";

export default function useGuestMembership({
  enabled = true,
} = {}) {
  const {showToast} = useToast();
  const query = useQuery({
    queryKey: ["guest-membership"],

    enabled,

    staleTime: 5 * 60 * 1000,

    queryFn: MembershipAPI.myRequests,

    select: (data) => ({
      membership: {
        status:
          data?.membership_status ?? null,

        data:
          data?.membership ?? null,

        hasActiveRequest:
          data?.has_active_request ?? false,
      },
    }),

    onError: (error) => {
      console.error(error);

      showToast(
        error?.message ??
          "Failed to load membership status",
          {type: "error"}
      );
    },
  });

  return {
    membership:
      query.data?.membership ?? {
        status: null,
        data: null,
        hasActiveRequest: false,
      },

    loading: query.isPending,

    error: query.error,

    refresh: query.refetch,

    isFetching: query.isFetching,

    isRefetching:
      query.isRefetching,
  };
}