import { useEffect, useState, useRef } from "react";
import { MessagesAPI } from "../../utils/api";
import styles from "../../styles/messages/ChatWindow.module.css";
import { useAuth } from "../../context/AuthContext";
import { ArrowLeft } from "lucide-react";

export default function ChatWindow({ threadId, recipient, onBack, onThreadCreated }) {
  const { user } = useAuth();
  const currentProfileId = user?.id;

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [localThreadId, setLocalThreadId] = useState(threadId);

  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  const formatTime = (date) =>
    new Date(date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  const getMessageStatus = (msg) => {
    if (!msg.is_me) return null;
    if (!msg.delivered) return "sent";
    if (msg.is_read) return "read";
    return "delivered";
  };

  const renderStatus = (msg) => {
    const status = getMessageStatus(msg);
    if (status === "sent") return "✓";
    if (status === "delivered") return "✓";
    if (status === "read") return <span style={{ color: "#53bdeb" }}>✓</span>;
  };

  const otherUserName =
    recipient?.other_user_name ||
    recipient?.full_name ||
    messages.find((m) =>!m.is_me)?.sender?.full_name ||
    "Conversation";

  const loadMessages = async (silent = false) => {
    if (!threadId ||!currentProfileId) return;
    try {
      if (!silent) setLoading(true);
      const res = await MessagesAPI.getConversation(threadId);
      const normalized = Array.isArray(res.messages)
       ? res.messages
           .map((m) => ({...m, is_me: String(m.sender_id) === String(currentProfileId) }))
           .sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
        : [];
      setMessages(normalized);
    } catch (err) {
      console.error("Failed to load messages:", err);
    } finally {
      if (!silent) setLoading(false);
    }
  };

  const sendMessage = async () => {
    const trimmed = text.trim();
    if (!trimmed || sending) return;

    const isReply =!!localThreadId;
    const recipientId = recipient?.id;

    if (!isReply &&!recipientId) {
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
      delivered: false,
    };

    setMessages((prev) => [...prev, tempMessage]);
    setText("");

    try {
      const payload = isReply
       ? { content: trimmed, thread_id: localThreadId }
        : { content: trimmed, recipient_profile_id: recipientId };

      const res = await MessagesAPI.send(payload);

      if (!isReply && res.thread_id) {
        setLocalThreadId(res.thread_id);
        onThreadCreated?.(res.thread_id);
      }

      if (res.message) {
        setMessages(prev => prev.map(m => m.id === tempId? {...res.message, is_me: true } : m));
      } else {
        loadMessages(true);
      }
    } catch (err) {
      console.error("Failed to send message:", err);
      setMessages((prev) => prev.filter((m) => m.id!== tempId));
      alert(err?.response?.data?.error || "Failed to send message");
    } finally {
      setSending(false);
      inputRef.current?.focus();
    }
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    setLocalThreadId(threadId);
    if (threadId) {
      loadMessages();
    } else {
      setMessages([]);
    }
  }, [threadId]);

  useEffect(() => {
    if (!threadId) return;
    MessagesAPI.markAsRead(threadId).catch(() => {});
  }, [threadId]);

  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === "visible") loadMessages(true);
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, [threadId]);

  useEffect(() => {
    if (!threadId) return;
    const interval = setInterval(() => loadMessages(true), 10000);
    return () => clearInterval(interval);
  }, [threadId]);

  if (!threadId &&!recipient) {
    return <div className={styles.emptyState}><p>Select a conversation or start a new chat</p></div>;
  }

  if (loading &&!messages.length) {
    return <div className={styles.loading}>Loading...</div>;
  }

  return (
    <div className="content">
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <button className={styles.backBtn} onClick={onBack}>
            <ArrowLeft size={20} />
          </button>
          <div className={styles.avatar}>{otherUserName[0]?.toUpperCase()}</div>
          <div>
            <div className={styles.name}>{otherUserName}</div>
            <div className={styles.status}>Online</div>
          </div>
        </div>
      </div>

      <div className={styles.messages}>
        {messages.length === 0? (
          <div className={styles.empty}>No messages yet</div>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} className={`${styles.row} ${msg.is_me? styles.me : styles.other}`}>
              <div className={styles.bubble}>
                {!msg.is_me && <span className={styles.sender}>{msg.sender?.full_name}</span>}
                <div className={styles.text}>{msg.content}</div>
                <div className={styles.meta}>
                  <span>{formatTime(msg.created_at)}</span>
                  {msg.is_me && renderStatus(msg)}
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={bottomRef} />
      </div>

      <div className={styles.inputArea}>
        <input
          className={styles.input}
          ref={inputRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type message..."
          disabled={sending}
          onKeyDown={(e) => {
            if (e.key === "Enter" &&!e.shiftKey) {
              e.preventDefault();
              sendMessage();
            }
          }}
        />
        <button className={styles.sendBtn} onClick={sendMessage} disabled={sending ||!text.trim()}>
          {sending? "Sending..." : "Send"}
        </button>
      </div>
    </div>
  );
}
