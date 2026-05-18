import { useEffect, useState } from "react";
import { NotificationsAPI } from "../utils/api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/pages.css";
import "../styles/notifications.css";

export default function NotificationsDropdown({ onClose, refreshUnread }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const { refetchUser } = useAuth();
  const navigate = useNavigate();

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
      {/* Header */}
      <div className="notification-header">
        <h4>Notifications</h4>

        <div className="notification-header-actions">
          {notifications.length > 0 && (
            <button onClick={markAll}>Mark all</button>
          )}

          <button className="close-x" onClick={onClose}>
            ✕
          </button>
        </div>
      </div>

      {/* States */}
      {loading && (
        <p className="notification-loading">Loading...</p>
      )}

      {!loading && notifications.length === 0 && (
        <p className="notification-empty">No notifications</p>
      )}

      {/* List */}
      {!loading && notifications.length > 0 && (
        <div className="notification-body-list">
          {notifications.map((n) => (
            <div
              key={n.id}
              className={`notification-item ${
                n.is_read ? "read" : "unread"
              }`}
              onClick={() => !n.is_read && markAsRead(n.id)}
            >
              <p className="notification-title">{n.title}</p>
              <p className="notification-message">{n.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
