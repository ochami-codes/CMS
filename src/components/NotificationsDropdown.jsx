import { useEffect, useState, useCallback, useRef } from "react";
import { NotificationsAPI } from "../utils/api";
import styles from "../styles/components/NotificationsDropdown.module.css";

export default function NotificationsDropdown({ onClose, refreshUnread }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingIds, setUpdatingIds] = useState(new Set());

  const loadNotifications = useCallback(async (signal) => {
    setLoading(true);
    try {
      const res = await NotificationsAPI.getAll({ page: 1, limit: 10 }, { signal });
      setNotifications(res?.notifications || []);
    } catch (err) {
      if (err.name!== "AbortError") console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    loadNotifications(controller.signal);
    return () => controller.abort();
  }, [loadNotifications]);

  const markAsRead = async (id) => {
    if (updatingIds.has(id)) return;

    setUpdatingIds(prev => new Set(prev).add(id));

    const prevNotifications = notifications;
    setNotifications(prev =>
      prev.map(n => n.id === id? {...n, is_read: true } : n)
    );

    try {
      await NotificationsAPI.markAsRead(id);
      refreshUnread?.();
    } catch (err) {
      console.error(err);
      setNotifications(prevNotifications); // rollback on failure
    } finally {
      setUpdatingIds(prev => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  };

  const markAll = async () => {
    const unreadIds = notifications.filter(n =>!n.is_read).map(n => n.id);
    if (unreadIds.length === 0) return;

    setUpdatingIds(prev => new Set([...prev,...unreadIds]));

    const prevNotifications = notifications;
    setNotifications(prev => prev.map(n => ({...n, is_read: true })));

    try {
      await NotificationsAPI.markAllAsRead();
      refreshUnread?.();
    } catch (err) {
      console.error(err);
      setNotifications(prevNotifications);
    } finally {
      setUpdatingIds(prev => {
        const next = new Set(prev);
        unreadIds.forEach(id => next.delete(id));
        return next;
      });
    }
  };

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h4>Notifications</h4>
        <div className={styles.actions}>
          {notifications.some(n =>!n.is_read) && (
            <button onClick={markAll} disabled={updatingIds.size > 0}>
              Mark all
            </button>
          )}
          <button className={styles.closeBtn} onClick={onClose}>✕</button>
        </div>
      </div>

      {loading && <p className={styles.loading}>Loading...</p>}

      {!loading && notifications.length === 0 && (
        <p className={styles.empty}>No notifications</p>
      )}

      {!loading && notifications.length > 0 && (
        <div className={styles.body}>
          {notifications.map(n => (
            <div
              key={n.id}
              className={`${styles.item} ${n.is_read? styles.read : styles.unread}`}
              onClick={() =>!n.is_read && markAsRead(n.id)}
              style={{ opacity: updatingIds.has(n.id)? 0.6 : 1, pointerEvents: updatingIds.has(n.id)? "none" : "auto" }}
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
