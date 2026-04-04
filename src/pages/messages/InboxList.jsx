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

  // 🔁 Initial load
  useEffect(() => {
    loadInbox();
  }, []);

  // 🔄 Optional: auto refresh every 10s (feels real-time)
  useEffect(() => {
    const interval = setInterval(() => {
      loadInbox();
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
                onClick={() => onSelect(msg.message_id)}
              >
                {/* Top row */}
                <div className="inbox-top">
                  <strong className="sender">
                    {msg.sender_name || "Unknown"}
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
                    {new Date(msg.created_at).toLocaleTimeString()}
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
