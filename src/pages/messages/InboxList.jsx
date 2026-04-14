import "../../styles/messages.css";

export default function InboxList({
  inbox = [],
  onSelect,
  activeThreadId,
}) {
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

  return (
    <div className="inbox">
      {/* Body */}
      {inbox.length === 0 ? (
        <p className="inbox-info">No conversations yet</p>
      ) : (
        <div className="inbox-list">
          {inbox.map((thread) => {
            const isActive = activeThreadId === thread.thread_id;
            const isUnread = thread.unread_count > 0;

            return (
              <div
                key={thread.thread_id}
                className={`inbox-item ${isActive ? "active" : ""}`}
                onClick={() => onSelect(thread)} // ✅ pass full thread
              >
                {/* Avatar */}
                <div className="avatar">
                  {thread.other_user_name?.charAt(0)?.toUpperCase() || "U"}
                </div>

                {/* Content */}
                <div className="inbox-content">
                  <div className="inbox-top">
                    <strong className="sender">
                      {thread.other_user_name || "Unknown"}
                    </strong>

                    <span className="time">
                      {thread.last_message_at &&
                        formatTime(thread.last_message_at)}
                    </span>
                  </div>

                  <div className="inbox-bottom">
                    <p className="preview">
                      {thread.last_message?.length > 60
                        ? thread.last_message.slice(0, 60) + "..."
                        : thread.last_message || "No content"}
                    </p>

                    {isUnread && (
                      <span className="badge">
                        {thread.unread_count}
                      </span>
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
