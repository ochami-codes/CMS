import { useEffect, useState, useRef } from "react";
import { MessagesAPI } from "../../utils/api";

export default function ChatWindow({ threadId, recipient, onThreadCreated }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const bottomRef = useRef(null);

  const loadMessages = async () => {
    if (!threadId) return;
    setLoading(true);
    try {
      const res = await MessagesAPI.getConversation(threadId);
      setMessages(Array.isArray(res.messages) ? res.messages : []);
    } catch (err) {
      console.error("Failed to load messages:", err);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    const trimmed = text.trim();
    if (!trimmed || sending || (!threadId && !recipient)) return;

    setSending(true);

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
      const res = await MessagesAPI.send({
        content: trimmed,
        parent_message_id: threadId || null,
        recipient_profile_id: recipient?.id || null,
      });

      // If it's a new conversation, notify parent about new thread ID
      if (!threadId && res.message_id) {
        onThreadCreated?.(res.message_id); // 👈 parent sets threadId
      }

      // reload messages if thread exists
      if (threadId || res.message_id) {
        await loadMessages();
      }
    } catch (err) {
      console.error("Failed to send message:", err);
      setMessages((prev) => prev.filter((m) => m.id !== tempMessage.id));
    } finally {
      setSending(false);
    }
  };

  // Auto scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Load messages when thread changes
  useEffect(() => {
    if (threadId) {
      loadMessages();
    } else {
      setMessages([]); // empty for new conversation
    }
  }, [threadId, recipient]);

  // Polling
  useEffect(() => {
    if (!threadId) return;
    const interval = setInterval(() => loadMessages(), 5000);
    return () => clearInterval(interval);
  }, [threadId]);

  if (!threadId && !recipient) {
    return (
      <div className="chat-window empty">
        <p>Select a conversation or start a new chat</p>
      </div>
    );
  }

  return (
    <div className="chat-window">
      <div className="chat-messages">
        {loading ? (
          <p className="chat-info">Loading messages...</p>
        ) : messages.length === 0 ? (
          <p className="chat-info">
            {recipient ? `Start a chat with ${recipient.name}` : "No messages yet"}
          </p>
        ) : (
          messages.map((m) => {
            const isMe = m.is_me || m.sender_name === "You";
            return (
              <div key={m.id} className={`chat-bubble ${isMe ? "me" : "other"}`}>
                {!isMe && <span className="chat-sender">{m.sender_name || "Unknown"}</span>}
                <p>{m.content}</p>
                {m.created_at && <span className="chat-time">{new Date(m.created_at).toLocaleTimeString()}</span>}
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

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
