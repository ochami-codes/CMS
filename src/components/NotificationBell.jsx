// src/components/NotificationBell.jsx
import { useEffect, useState, useRef } from "react";
import { Bell } from "lucide-react";
import NotificationsDropdown from "./NotificationsDropdown";
import { NotificationsAPI } from "../utils/api";
import "../styles/pages.css";

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
      if (bellRef.current && !bellRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="notification-wrapper" ref={bellRef}>
      <button
        className={`notification-bell ${unread > 0 ? "has-unread" : ""}`}
        onClick={() => setOpen((prev) => !prev)}
      >
        <Bell size={20} />
        {unread > 0 && (
          <span className="notification-badge">
            {unread > 99 ? "99+" : unread}
          </span>
        )}
      </button>

      <div className={`dropdown-container ${open ? "open" : ""}`}>
        {open && (
          <NotificationsDropdown
            onClose={() => setOpen(false)}
            refreshUnread={loadUnread}
          />
        )}
      </div>
    </div>
  );
}
