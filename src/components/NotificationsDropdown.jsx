import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import { NotificationsAPI } from "../utils/api";

import styles from "../styles/components/NotificationsDropdown.module.css";

export default function NotificationsDropdown({
  onClose,
  refreshUnread
}) {

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const { refetchUser } = useAuth();
  const navigate = useNavigate();

  const loadNotifications = async () => {
    setLoading(true);

    try {
      const res =
        await NotificationsAPI.getAll({
          page: 1,
          limit: 10
        });

      setNotifications(
        res?.notifications || []
      );

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const markAsRead = async (id) => {
    try {
      await NotificationsAPI.markAsRead(id);

      setNotifications(prev =>
        prev.map(n =>
          n.id === id
            ? { ...n, is_read: true }
            : n
        )
      );

      refreshUnread?.();
    } catch (err) {
      console.error(err);
    }
  };

  const markAll = async () => {
    try {
      await NotificationsAPI.markAllAsRead();

      setNotifications(prev =>
        prev.map(n => ({
          ...n,
          is_read: true
        }))
      );

      refreshUnread?.();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className={styles.card}>

      {/* HEADER */}
      <div className={styles.header}>

        <h4>Notifications</h4>

        <div className={styles.actions}>

          {notifications.length > 0 && (
            <button onClick={markAll}>
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

      {/* STATES */}
      {loading && (
        <p className={styles.loading}>
          Loading...
        </p>
      )}

      {!loading &&
        notifications.length === 0 && (
          <p className={styles.empty}>
            No notifications
          </p>
      )}

      {/* LIST */}
      {!loading &&
        notifications.length > 0 && (
          <div className={styles.body}>

            {notifications.map(n => (
              <div
                key={n.id}
                className={`${styles.item} ${
                  n.is_read
                    ? styles.read
                    : styles.unread
                }`}
                onClick={() =>
                  !n.is_read &&
                  markAsRead(n.id)
                }
              >
                <p>{n.title}</p>
                <p>{n.message}</p>
              </div>
            ))}

          </div>
      )}

    </div>
  );
}
