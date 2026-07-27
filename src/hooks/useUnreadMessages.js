import { useQuery } from "@tanstack/react-query";

import { MessagesAPI } from "../utils/api";

export default function useUnreadMessages() {
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

    // Poll every 60 seconds
    refetchInterval: 60000,

    // Also fetch when the window regains focus
    refetchOnWindowFocus: true,

    staleTime: 30000,
  });

  return {
    /* =========================
       DATA
    ========================== */

    unreadMessages:
      query.data ?? 0,

    /* =========================
       QUERY STATE
    ========================== */

    loading:
      query.isLoading,

    isFetching:
      query.isFetching,

    isError:
      query.isError,

    error:
      query.error,

    /* =========================
       QUERY ACTION
    ========================== */

    refreshUnreadMessages:
      query.refetch,
  };
}
