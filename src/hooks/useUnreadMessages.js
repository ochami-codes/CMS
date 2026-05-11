import { useEffect, useState } from "react";
import { MessagesAPI } from "../utils/api";

export default function useUnreadMessages() {
  const [unreadMessages, setUnreadMessages] =
    useState(0);

  // =========================
  // FETCH FUNCTION
  // =========================

  const fetchUnread = async () => {
    try {
      const res =
        await MessagesAPI.getUnreadCount();

      setUnreadMessages(
        res?.count || 0
      );

    } catch (err) {
      console.error(
        "Failed to fetch unread messages:",
        err
      );
    }
  };

  // =========================
  // POLLING
  // =========================

  useEffect(() => {
    fetchUnread();

    const interval = setInterval(
      fetchUnread,
      60000
    );

    return () =>
      clearInterval(interval);

  }, []);

  return {
    unreadMessages,
    refreshUnreadMessages:
      fetchUnread,
  };
}
