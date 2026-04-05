// src/pages/messages/InboxList.jsx
import { useEffect, useState } from "react";
import { MessagesAPI } from "../../utils/api";

export default function InboxList({ onSelect, activeThreadId }) {
  const [inbox, setInbox] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadInbox = async () => {
    try {
      setLoading(true);
      const res = await MessagesAPI.getInbox();
      setInbox(Array.isArray(res.inbox) ? res.inbox : []);
    } catch (err) {
      console.error("Failed to load inbox:", err);
    } finally {
      setLoading(false);
    }
  };

const formatTime = (date) => {
  const d = new Date(date);
  const now = new Date();

  const isToday = d.toDateString() === now.toDateString();

  if (isToday) return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  return d.toLocaleDateString();
};

  // 🔁 Initial load
  useEffect(() => {
    loadInbox();
  }, []);

  // 🔄 Optional: auto refresh every 10s (feels real-time)
  useEffect(() => {
  const interval = setInterval(() => {
    if (document.visibilityState === "visible") {
      loadInbox();
    }
  }, 10000);

  return () => clearInterval(interval);
}, []);

  const unreadCount = inbox.filter((msg) => !msg.is_read).length;

  return (
    <div className="inbox">
      {/* Header */}
      <div className="inbox-header">
        <h3>
          Messages {unreadCount > 0 && `(${unreadCount})`}
        </h3>

        <button onClick={loadInbox} className="refresh-btn">
          Refresh
        </button>
      </div>

      {/* States */}
      {loading ? (
        <p className="inbox-info">Loading messages...</p>
      ) : inbox.length === 0 ? (
        <p className="inbox-info">No conversations yet</p>
      ) : (
        <div className="inbox-list">
          {inbox.map((msg) => {
            const isActive = activeThreadId === msg.message_id;

            return (
              <div
                key={msg.message_id}
                className={`inbox-item ${isActive ? "active" : ""} ${
                  !msg.is_read ? "unread" : ""
                }`}
                onClick={async () => {
  onSelect(msg.message_id);

  if (!msg.is_read) {
    try {
      await MessagesAPI.markAsRead(msg.message_id);
      loadInbox(); // refresh UI
    } catch (err) {
      console.error("Failed to mark as read:", err);
    }
  }
}}
              >
                {/* Top row */}
                <div className="inbox-top">
<strong className="sender">
  {msg.is_from_me ? "You" : msg.other_user_name}
</strong>
                  {!msg.is_read && (
                    <span className="badge">New</span>
                  )}
                </div>

                {/* Message preview */}
                <p className="preview">
                  {msg.content
                    ? msg.content.length > 60
                      ? msg.content.slice(0, 60) + "..."
                      : msg.content
                    : "No content"}
                </p>

                {/* Timestamp (if available) */}
                {msg.created_at && (
       <span className="time">
  {formatTime(msg.created_at)}
</span>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
