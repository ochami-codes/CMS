import { useMutation, useQueryClient } from "@tanstack/react-query";
import { NotificationsAPI } from "../../utils/api";

export default function useMarkAllNotificationsAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () =>
      NotificationsAPI.markAllAsRead(),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["notifications"],
      });

      queryClient.invalidateQueries({
        queryKey: ["notifications-unread"],
      });
    },
  });
}