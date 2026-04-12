import { useEffect, useState, useRef, useMemo } from "react";
import { MessagesAPI } from "../../utils/api";
import "../../styles/messages.css";

export default function InboxList({ onSelect, activeThreadId }) {
  const [inbox, setInbox] = useState([]);
  const [loading, setLoading] = useState(false);
  const intervalRef = useRef(null);

  const loadInbox = async (silent = false) => {
    try {
      if (!silent) setLoading(true);

      const res = await MessagesAPI.getInbox();
      setInbox(Array.isArray(res.inbox) ? res.inbox : []);
    } catch (err) {
      console.error("Failed to load inbox:", err);
    } finally {
      if (!silent) setLoading(false);
    }
  };

  const formatTime = (date) => {
    const d = new Date(date);
    const now = new Date();

    const isToday = d.toDateString() === now.toDateString();

    if (isToday) {
      return d.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    }

    return d.toLocaleDateString();
  };

  // Initial load
  useEffect(() => {
    loadInbox();
  }, []);

  // Smart background refresh
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      if (document.visibilityState === "visible") {
        loadInbox(true);
      }
    }, 15000);

    return () => clearInterval(intervalRef.current);
  }, []);

  const unreadCount = useMemo(
    () => inbox.reduce((sum, msg) => sum + (msg.unread_count || 0), 0),
    [inbox]
  );

  return (
    <div className="inbox">
      {/* Header */}
      <div className="inbox-header">
        <h3>
          Messages {unreadCount > 0 && `(${unreadCount})`}
        </h3>

        <button onClick={() => loadInbox()} className="refresh-btn">
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
            const isActive = activeThreadId === msg.thread_id;
            const isUnread = msg.unread_count > 0;

            return (
              <div
                key={msg.thread_id}
                className={`inbox-item ${isActive ? "active" : ""}`}
                onClick={async () => {
                  onSelect(msg.thread_id);

                  if (isUnread) {
                    setInbox((prev) =>
                      prev.map((item) =>
                        item.thread_id === msg.thread_id
                          ? { ...item, unread_count: 0 }
                          : item
                      )
                    );

                    try {
                      await MessagesAPI.markAsRead(msg.thread_id);
                    } catch (err) {
                      console.error("Failed to mark as read:", err);
                    }
                  }
                }}
              >
                {/* Avatar */}
                <div className="avatar">
                  {msg.other_user_name?.charAt(0)?.toUpperCase() || "U"}
                </div>

                {/* Content */}
                <div className="inbox-content">
                  <div className="inbox-top">
                    <strong className="sender">
                      {msg.other_user_name || "Unknown"}
                    </strong>

                    <span className="time">
                      {msg.last_message_at &&
                        formatTime(msg.last_message_at)}
                    </span>
                  </div>

                  <div className="inbox-bottom">
                    <p className="preview">
                      {msg.last_message?.length > 60
                        ? msg.last_message.slice(0, 60) + "..."
                        : msg.last_message || "No content"}
                    </p>

                    {isUnread && (
                      <span className="badge">{msg.unread_count}</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
