import { useQuery } from "@tanstack/react-query";
import { NotificationsAPI } from "../../utils/api";

export default function useNotifications({
  page = 1,
  limit = 10,
  enabled = true,
} = {}) {
  return useQuery({
    queryKey: ["notifications", page, limit],

    queryFn: ({ signal }) =>
      NotificationsAPI.getAll(
        { page, limit },
        { signal }
      ),

    enabled,

    select: (data) => ({
      notifications: data?.notifications || [],
      pagination: data?.pagination || null,
    }),

    staleTime: 30 * 1000,
  });
}