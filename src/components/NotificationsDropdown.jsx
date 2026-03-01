import { useEffect, useState } from "react";
import { NotificationsAPI, MembershipAPI } from "../utils/api";

export default function NotificationsDropdown({ onClose, refreshUnread }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState({}); // { [notificationId]: "accepted" | "rejected" }

  /* -----------------------------------
     Load Notifications
  ----------------------------------- */
  const loadNotifications = async () => {
    setLoading(true);
    try {
      const res = await NotificationsAPI.getAll({ page: 1, limit: 10 });
      setNotifications(res?.notifications || []);
    } catch (err) {
      console.error("Failed to load notifications:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  /* -----------------------------------
     Mark Single as Read
  ----------------------------------- */
  const markAsRead = async (id) => {
    try {
      await NotificationsAPI.markAsRead(id);

      setNotifications((prev) =>
        prev.map((n) =>
          n.id === id ? { ...n, is_read: true } : n
        )
      );

      refreshUnread?.();
    } catch (err) {
      console.error("Mark as read failed:", err);
    }
  };

  /* -----------------------------------
     Accept / Reject Invite
  ----------------------------------- */
  const respondInvite = async (notification, action) => {
    const notifId = notification.id;

    try {
      setActionLoading((prev) => ({
        ...prev,
        [notifId]: action,
      }));

      await MembershipAPI.respondInvite(
        notification.related_id,
        action
      );

      // Mark as read after successful action
      await markAsRead(notifId);
    } catch (err) {
      console.error("Invite response failed:", err);
    } finally {
      setActionLoading((prev) => ({
        ...prev,
        [notifId]: null,
      }));
    }
  };

  /* -----------------------------------
     Mark All as Read
  ----------------------------------- */
  const markAll = async () => {
    try {
      await NotificationsAPI.markAllAsRead();

      setNotifications((prev) =>
        prev.map((n) => ({ ...n, is_read: true }))
      );

      refreshUnread?.();
    } catch (err) {
      console.error("Mark all failed:", err);
    }
  };

  return (
    <div className="notification-card">
      <div className="notification-header">
        <h4>Notifications</h4>
        {notifications.length > 0 && (
          <button onClick={markAll}>Mark all</button>
        )}
      </div>

      {loading && (
        <p className="notification-loading">Loading...</p>
      )}

      {!loading && notifications.length === 0 && (
        <p className="notification-empty">
          No notifications
        </p>
      )}

      {!loading &&
        notifications.map((n) => {
          const isProcessing = !!actionLoading[n.id];

          return (
            <div
              key={n.id}
              className={`notification-item ${
                n.is_read ? "read" : "unread"
              }`}
            >
              <div
                className="notification-body"
                onClick={() =>
                  !n.is_read && !isProcessing && markAsRead(n.id)
                }
              >
                <p className="notification-title">
                  {n.title}
                </p>
                <p className="notification-message">
                  {n.message}
                </p>
              </div>

              {/* Membership Invite Actions */}
              {n.type === "membership_invite" &&
                !n.is_read && (
                  <div className="notification-actions">
                    <button
                      className="accept-btn"
                      disabled={isProcessing}
                      onClick={() =>
                        respondInvite(n, "accepted")
                      }
                    >
                      {actionLoading[n.id] === "accepted" ? (
                        <span className="btn-spinner" />
                      ) : (
                        "Accept"
                      )}
                    </button>

                    <button
                      className="reject-btn"
                      disabled={isProcessing}
                      onClick={() =>
                        respondInvite(n, "rejected")
                      }
                    >
                      {actionLoading[n.id] === "rejected" ? (
                        <span className="btn-spinner" />
                      ) : (
                        "Reject"
                      )}
                    </button>
                  </div>
                )}
            </div>
          );
        })}
    </div>
  );
}
