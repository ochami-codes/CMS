import { useEffect, useState, useRef } from "react";
import { MessagesAPI } from "../../utils/api";
import "../../styles/messages.css";

export default function ChatWindow({
  threadId,
  recipient,
  currentProfileId,
  onThreadCreated,
}) {
  // -----------------------------
  // State & Refs
  // -----------------------------
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [localThreadId, setLocalThreadId] = useState(threadId);

  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  // -----------------------------
  // Helpers
  // -----------------------------
  const formatTime = (date) =>
    new Date(date).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

  const getMessageStatus = (msg) => {
    if (!msg.is_me) return null;
    if (!msg.delivered) return "sent";
    if (msg.is_read) return "read";
    return "delivered";
  };

  const renderStatus = (msg) => {
    if (!msg.is_me) return null;

    const status = getMessageStatus(msg);

    if (status === "sent") return "✓";
    if (status === "delivered") return "✓✓";
    if (status === "read")
      return <span style={{ color: "blue" }}>✓✓</span>;

    return "✓";
  };

  const otherUserName =
    recipient?.other_user_name ||
    recipient?.full_name ||
    messages.find((m) => !m.is_me)?.sender?.full_name ||
    "Conversation";

  // -----------------------------
  // Load Messages
  // -----------------------------
  const loadMessages = async (silent = false) => {
    if (!threadId) return;

    try {
      if (!silent) setLoading(true);

      const res = await MessagesAPI.getConversation(threadId);

const normalized = Array.isArray(res.messages)
  ? res.messages
      .map((m) => {
        console.log({
          sender_id: m.sender_id,
         current:currentProfileId,
          equal: m.sender_id === currentProfileId,
        });

        return {
          ...m,
          is_me: m.sender_id === currentProfileId,
        };
      })
      .sort(
        (a, b) =>
          new Date(a.created_at) - new Date(b.created_at)
      )
  : [];
      setMessages(normalized);
    } catch (err) {
      console.error("Failed to load messages:", err);
    } finally {
      if (!silent) setLoading(false);
    }
  };

  // -----------------------------
  // Send Message
  // -----------------------------
  const sendMessage = async () => {
    const trimmed = text.trim();
    if (!trimmed || sending) return;

    const isReply = !!localThreadId;
    const recipientId = recipient?.id;

    if (!isReply && !recipientId) {
      alert("No recipient selected");
      return;
    }

    setSending(true);

    const tempId = `temp-${Date.now()}`;

    const tempMessage = {
      id: tempId,
      content: trimmed,
      sender_id: currentProfileId,
      sender: { full_name: "You" },
      is_me: true,
      created_at: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, tempMessage]);
    setText("");

    try {
      const payload = isReply
        ? {
            content: trimmed,
            thread_id: localThreadId,
          }
        : {
            content: trimmed,
            recipient_profile_id: recipientId,
          };

      const res = await MessagesAPI.send(payload);

      // Handle new thread creation
      if (!isReply && res.thread_id) {
        setLocalThreadId(res.thread_id);
        onThreadCreated?.(res.thread_id);
      }

      if (isReply || res.thread_id) {
        loadMessages(true);
      }
    } catch (err) {
      console.error("Failed to send message:", err);
      setMessages((prev) => prev.filter((m) => m.id !== tempId));
      alert(err?.response?.data?.error || "Failed to send message");
    } finally {
      setSending(false);
      inputRef.current?.focus();
    }
  };

  // -----------------------------
  // Effects
  // -----------------------------

  // Auto-scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Load messages on thread change
  useEffect(() => {
    if (threadId) {
      loadMessages();
    } else {
      setMessages([]);
    }
  }, [threadId]);

  // Sync local thread
  useEffect(() => {
    setLocalThreadId(threadId);
  }, [threadId]);

  // Mark as read
  useEffect(() => {
    if (!threadId) return;
    MessagesAPI.markAsRead(threadId).catch(() => {});
  }, [threadId]);

  // Reload on tab focus
  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        loadMessages(true);
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);
    return () =>
      document.removeEventListener(
        "visibilitychange",
        handleVisibility
      );
  }, [threadId]);

  // Polling (temporary)
  useEffect(() => {
    if (!threadId) return;

    const interval = setInterval(() => {
      loadMessages(true);
    }, 10000);

    return () => clearInterval(interval);
  }, [threadId]);

  // -----------------------------
  // Empty State
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
      {/* Header */}
      <div className="chat-header">
        <div className="chat-header-left">
          <div className="chat-header-avatar">
            {otherUserName.charAt(0).toUpperCase()}
          </div>

          <div className="chat-header-info">
            <span className="chat-header-name">
              {otherUserName}
            </span>
            <span className="chat-header-status">Online</span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="chat-messages">
        {loading ? (
          <p className="chat-info">Loading messages...</p>
        ) : messages.length === 0 ? (
          <p className="chat-info">
            {recipient
              ? `Start a chat with ${recipient.full_name}`
              : "No messages yet"}
          </p>
        ) : (
          messages.map((msg) => { console.log(msg.content, msg.is_me); 
return(
            <div
              key={msg.id}
              className={`chat-message ${
                msg.is_me ? "me" : "other"
              }`}
            >
              <div className="chat-bubble">
                {!msg.is_me && (
                  <span className="chat-sender">
                    {msg.sender?.full_name}
                  </span>
                )}

                <p>{msg.content}</p>

                <div className="chat-meta">
                  <span className="time">
                    {formatTime(msg.created_at)}
                  </span>

                  {msg.is_me && (
                    <span className="status">
                      {renderStatus(msg)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          )
})
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="chat-input">
        <input
          ref={inputRef}
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
