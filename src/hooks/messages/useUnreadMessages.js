import { useQuery } from "@tanstack/react-query";

import { MessagesAPI } from "../../utils/api";

export default function useUnreadMessages(
  enabled = true
) {
  const query = useQuery({
    queryKey: [
      "messages",
      "unread-count",
    ],

    queryFn: async () => {
      const response =
        await MessagesAPI.getUnreadCount();

      return response?.count ?? 0;
    },

    enabled,

    // Poll every 60 seconds
    refetchInterval: 60000,

    // Also fetch when the window regains focus
    refetchOnWindowFocus: true,

    staleTime: 30000,
  });

  return {
    unreadMessages:
      query.data ?? 0,

    loading:
      query.isLoading,

    isFetching:
      query.isFetching,

    isError:
      query.isError,

    error:
      query.error,

    refreshUnreadMessages:
      query.refetch,
  };
}
