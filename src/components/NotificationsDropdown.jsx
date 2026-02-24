// src/components/NotificationsDropdown.jsx
import { useEffect, useState } from "react";
import { NotificationsAPI, MembershipAPI } from "../utils/api";

export default function NotificationsDropdown({ onClose, refreshUnread }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  /* -----------------------------
     Load notifications
  ----------------------------- */
  const loadNotifications = async () => {
    try {
      const res = await NotificationsAPI.getAll({ page: 1, limit: 10 });
      setNotifications(res.notifications || []);
    } catch (err) {
      console.error("Failed to load notifications", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  /* -----------------------------
     Mark single as read
  ----------------------------- */
  const markAsRead = async (id) => {
    try {
      await NotificationsAPI.markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === id ? { ...n, is_read: true } : n
        )
      );
      refreshUnread();
    } catch (err) {
      console.error(err);
    }
  };

  /* -----------------------------
     Accept / Reject invite
  ----------------------------- */
  const respondInvite = async (notification, action) => {
    try {
      await MembershipAPI.respondInvite(
        notification.related_id,
        action
      );

      await markAsRead(notification.id);
    } catch (err) {
      console.error(err);
    }
  };

  /* -----------------------------
     Mark all as read
  ----------------------------- */
  const markAll = async () => {
    try {
      await NotificationsAPI.markAllAsRead();
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, is_read: true }))
      );
      refreshUnread();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="notification-dropdown">
      <div className="notification-header">
        <h4>Notifications</h4>
        <button onClick={markAll}>Mark all</button>
      </div>

      {loading && <p className="notification-loading">Loading...</p>}

      {!loading && notifications.length === 0 && (
        <p className="notification-empty">No notifications</p>
      )}

      {!loading &&
        notifications.map((n) => (
          <div
            key={n.id}
            className={`notification-item ${
              n.is_read ? "read" : "unread"
            }`}
            onClick={() => !n.is_read && markAsRead(n.id)}
          >
            <p className="notification-title">{n.title}</p>
            <p className="notification-message">{n.message}</p>

            {/* Invite UI */}
            {n.type === "membership_invite" && !n.is_read && (
              <div className="notification-actions">
                <button
                  className="accept-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    respondInvite(n, "accepted");
                  }}
                >
                  Accept
                </button>

                <button
                  className="reject-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    respondInvite(n, "rejected");
                  }}
                >
                  Reject
                </button>
              </div>
            )}
          </div>
        ))}
    </div>
  );
}
