import { useMutation, useQueryClient } from "@tanstack/react-query";
import { NotificationsAPI } from "../../utils/api";

export default function useMarkNotificationAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (notificationId) =>
      NotificationsAPI.markAsRead(notificationId),

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