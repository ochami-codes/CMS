import { useState } from "react";

import useNotifications from "../hooks/notifications/useNotifications";
import useMarkNotificationAsRead from "../hooks/notifications/useMarkNotificationAsRead";
import useMarkAllNotificationsAsRead from "../hooks/notifications/useMarkAllNotifications";
import useUnreadNotifications from "../hooks/notifications/useUnreadNotifications";

import styles from "../styles/components/NotificationsDropdown.module.css";

export default function NotificationsDropdown({ onClose }) {
  const [updatingIds, setUpdatingIds] = useState(new Set());

  const {
    data,
    isLoading,
    isFetching,
    error,
  } = useNotifications({
    page: 1,
    limit: 10,
  });

  // Keeps the unread query synchronized after mutations.
  useUnreadNotifications();

  const markNotificationAsRead =
    useMarkNotificationAsRead();

  const markAllNotificationsAsRead =
    useMarkAllNotificationsAsRead();

  const notifications = data?.notifications || [];

  const markAsRead = async (id) => {
    if (
      updatingIds.has(id) ||
      markNotificationAsRead.isPending
    ) {
      return;
    }

    setUpdatingIds((prev) =>
      new Set(prev).add(id)
    );

    try {
      await markNotificationAsRead.mutateAsync(id);
    } catch (err) {
      console.error(err);
    } finally {
      setUpdatingIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  };

  const markAll = async () => {
    const unreadIds = notifications
      .filter((notification) => !notification.is_read)
      .map((notification) => notification.id);

    if (
      unreadIds.length === 0 ||
      markAllNotificationsAsRead.isPending
    ) {
      return;
    }

    setUpdatingIds(
      new Set(unreadIds)
    );

    try {
      await markAllNotificationsAsRead.mutateAsync();
    } catch (err) {
      console.error(err);
    } finally {
      setUpdatingIds((prev) => {
        const next = new Set(prev);

        unreadIds.forEach((id) => {
          next.delete(id);
        });

        return next;
      });
    }
  };

  if (error) {
    console.error(error);
  }

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h4>Notifications</h4>

        <div className={styles.actions}>
          {notifications.some(
            (notification) => !notification.is_read
          ) && (
            <button
              onClick={markAll}
              disabled={updatingIds.size > 0}
            >
              Mark all
            </button>
          )}

          <button
            className={styles.closeBtn}
            onClick={onClose}
          >
            ✕
          </button>
        </div>
      </div>

      {isLoading && (
        <p className={styles.loading}>
          Loading...
        </p>
      )}

      {!isLoading && notifications.length === 0 && (
        <p className={styles.empty}>
          No notifications
        </p>
      )}

      {!isLoading && notifications.length > 0 && (
        <div className={styles.body}>
          {notifications.map((notification) => {
            const isUpdating =
              updatingIds.has(notification.id);

            return (
              <div
                key={notification.id}
                className={`${styles.item} ${
                  notification.is_read
                    ? styles.read
                    : styles.unread
                }`}
                onClick={() =>
                  !notification.is_read &&
                  markAsRead(notification.id)
                }
                style={{
                  opacity: isUpdating ? 0.6 : 1,
                  pointerEvents: isUpdating
                    ? "none"
                    : "auto",
                }}
              >
                <p>{notification.title}</p>
                <p>{notification.message}</p>
              </div>
            );
          })}
        </div>
      )}

      {isFetching && !isLoading && (
        <span className={styles.loading}>
          Updating...
        </span>
      )}
    </div>
  );
}
