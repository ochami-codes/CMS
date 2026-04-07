import { useEffect, useState, useRef } from "react";
import { MessagesAPI } from "../../utils/api";
import "../../styles/messages.css";
export default function ChatWindow({ threadId, recipient, onThreadCreated }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const bottomRef = useRef(null);

  // -----------------------------
  // Load messages
  // -----------------------------
  const loadMessages = async (silent = false) => {
    if (!threadId) return;

    try {
      if (!silent) setLoading(true);

      const res = await MessagesAPI.getConversation(threadId);
      setMessages(Array.isArray(res.messages) ? res.messages : []);
    } catch (err) {
      console.error("Failed to load messages:", err);
    } finally {
      if (!silent) setLoading(false);
    }
  };

  // -----------------------------
  // Send message
  // -----------------------------
  const sendMessage = async () => {
    const trimmed = text.trim();
    if (!trimmed || sending || (!threadId && !recipient)) return;

    setSending(true);

    const tempId = `temp-${Date.now()}`;

    const tempMessage = {
      id: tempId,
      content: trimmed,
      sender_name: "You",
      is_me: true,
      created_at: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, tempMessage]);
    setText("");

    try {
      const res = await MessagesAPI.send({
        content: trimmed,
        parent_message_id: threadId || null,
        recipient_profile_id: threadId ? null : recipient?.id, // ✅ KEY FIX
      });

      // 👉 New conversation
      if (!threadId && res.message_id) {
        onThreadCreated?.(res.message_id);
      }

      // Refresh messages (silent)
      if (threadId) {
        loadMessages(true);
      }
    } catch (err) {
      console.error("Failed to send message:", err);

      // rollback UI
      setMessages((prev) => prev.filter((m) => m.id !== tempId));
    } finally {
      setSending(false);
    }
  };

  // -----------------------------
  // Auto scroll
  // -----------------------------
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // -----------------------------
  // Load on thread change
  // -----------------------------
  useEffect(() => {
    if (threadId) {
      loadMessages();
    } else {
      setMessages([]);
    }
  }, [threadId, recipient]);

  // -----------------------------
  // Smart refresh (no polling)
  // -----------------------------
  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        loadMessages(true);
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [threadId]);

  // -----------------------------
  // Empty state
  // -----------------------------
  if (!threadId && !recipient) {
    return (
      <div className="chat-window empty">
        <p>Select a conversation or start a new chat</p>
      </div>
    );
  }

  // -----------------------------
  // UI
  // -----------------------------
  return (
    <div className="chat-window">
      {/* Messages */}
      <div className="chat-messages">
        {loading ? (
          <p className="chat-info">Loading messages...</p>
        ) : messages.length === 0 ? (
          <p className="chat-info">
            {recipient
              ? `Start a chat with ${recipient.name}`
              : "No messages yet"}
          </p>
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
                    {m.sender_name || "Unknown"}
                  </span>
                )}

                <p>{m.content}</p>

                {m.created_at && (
                  <span className="chat-time">
                    {new Date(m.created_at).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                )}
              </div>
            );
          })
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
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

        <button onClick={sendMessage} disabled={sending || !text.trim()}>
          {sending ? "Sending..." : "Send"}
        </button>
      </div>
    </div>
  );
}
