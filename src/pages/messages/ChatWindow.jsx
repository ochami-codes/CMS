// src/pages/messages/ChatWindow.jsx
import { useEffect, useState, useRef } from "react";
import { MessagesAPI } from "../../utils/api";

export default function ChatWindow({ threadId, targetRole }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);

  const bottomRef = useRef(null);

  // ------------------------
  // Load messages for thread or role
  // ------------------------
  const loadMessages = async () => {
    if (!threadId && !targetRole) return;

    try {
      setLoading(true);
      const res = threadId
        ? await MessagesAPI.getConversation(threadId)
        : await MessagesAPI.getConversationByRole(targetRole); // new API for role-based
      setMessages(Array.isArray(res.messages) ? res.messages : []);
    } catch (err) {
      console.error("Failed to load messages:", err);
    } finally {
      setLoading(false);
    }
  };

  // ------------------------
  // Send message
  // ------------------------
  const sendMessage = async () => {
    const trimmed = text.trim();
    if (!trimmed || sending || (!threadId && !targetRole)) return;

    setSending(true);

    // Optimistic message
    const tempMessage = {
      id: `temp-${Date.now()}`,
      content: trimmed,
      sender_name: "You",
      is_me: true,
      created_at: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, tempMessage]);
    setText("");

    try {
      await MessagesAPI.send({
        content: trimmed,
        parent_message_id: threadId || null,
        target_role_id: targetRole || null,
      });

      // Reload messages to sync with backend
      await loadMessages();
    } catch (err) {
      console.error("Failed to send message:", err);

      // Rollback optimistic message
      setMessages((prev) =>
        prev.filter((m) => m.id !== tempMessage.id)
      );
    } finally {
      setSending(false);
    }
  };

  // ------------------------
  // Auto-scroll to bottom
  // ------------------------
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Load when thread or role changes
  useEffect(() => {
    loadMessages();
  }, [threadId, targetRole]);

  // Polling for real-time feel
  useEffect(() => {
    if (!threadId && !targetRole) return;

    const interval = setInterval(() => {
      loadMessages();
    }, 5000);

    return () => clearInterval(interval);
  }, [threadId, targetRole]);

  if (!threadId && !targetRole) {
    return (
      <div className="chat-window empty">
        <p>Select a conversation or role to start chatting</p>
      </div>
    );
  }

  return (
    <div className="chat-window">
      {/* MESSAGES */}
      <div className="chat-messages">
        {loading ? (
          <p className="chat-info">Loading messages...</p>
        ) : messages.length === 0 ? (
          <p className="chat-info">No messages yet</p>
        ) : (
          messages.map((m) => {
            const isMe = m.is_me || m.sender_name === "You";

            return (
              <div
                key={m.id}
                className={`chat-bubble ${isMe ? "me" : "other"}`}
              >
                {!isMe && (
                  <span className="chat-sender">
                    {m.sender_name || m.other_user_name || "Unknown"}
                  </span>
                )}

                <p>{m.content}</p>

                {m.created_at && (
                  <span className="chat-time">
                    {new Date(m.created_at).toLocaleTimeString()}
                  </span>
                )}
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      {/* INPUT */}
      <div className="chat-input">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type message..."
          disabled={sending}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              sendMessage();
            }
          }}
        />

        <button
          onClick={sendMessage}
          disabled={sending || !text.trim()}
        >
          {sending ? "Sending..." : "Send"}
        </button>
      </div>
    </div>
  );
}
