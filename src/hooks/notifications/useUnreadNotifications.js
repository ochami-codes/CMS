import { useQuery } from "@tanstack/react-query";
import { NotificationsAPI } from "../../utils/api";

export default function useUnreadNotifications({
  enabled = true,
} = {}) {
  return useQuery({
    queryKey: ["notifications-unread"],

    queryFn: () =>
      NotificationsAPI.getUnreadCount(),

    enabled,

    select: (data) =>
      data?.notifications || [],

    staleTime: 30 * 1000,
  });
}