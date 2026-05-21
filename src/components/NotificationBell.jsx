import { useEffect, useState, useRef } from "react";
import { Bell } from "lucide-react";

import NotificationsDropdown from "./NotificationsDropdown";
import { NotificationsAPI } from "../utils/api";

import styles from "../styles/components/NotificationBell.module.css";

export default function NotificationBell() {

  const [unread, setUnread] = useState(0);
  const [open, setOpen] = useState(false);

  const bellRef = useRef(null);

  const loadUnread = async () => {
    try {
      const res = await NotificationsAPI.getUnreadCount();
      setUnread(res.unread || 0);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadUnread();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        bellRef.current &&
        !bellRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () =>
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
  }, []);

  return (
    <div
      className={styles.wrapper}
      ref={bellRef}
    >

      <button
        className={`${styles.bell} ${
          unread > 0 ? styles.hasUnread : ""
        }`}
        onClick={() =>
          setOpen(prev => !prev)
        }
      >

        <Bell size={20} />

        {unread > 0 && (
          <span className={styles.badge}>
            {unread > 99
              ? "99+"
              : unread}
          </span>
        )}

      </button>

      {open && (
        <div className={styles.dropdown}>
          <NotificationsDropdown
            onClose={() =>
              setOpen(false)
            }
            refreshUnread={loadUnread}
          />
        </div>
      )}

    </div>
  );
}
