import { useEffect, useRef, useState } from "react";
import { ArrowLeft } from "lucide-react";

import useConversationMessages from "../../hooks/messages/useConversationMessages";
import useSendMessage from "../../hooks/messages/useSendMessage";
import useMarkConversationAsRead from "../../hooks/messages/useMarkConversationAsRead";

import styles from "../../styles/messages/ChatWindow.module.css";

export default function ChatWindow({
  threadId,
  recipient,
  onBack,
  onThreadCreated,
}) {
  const [text, setText] = useState("");
  const [localThreadId, setLocalThreadId] =
    useState(threadId);

  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  const activeThreadId =
    localThreadId || threadId;

  const {
    data: messages = [],
    isLoading,
    error,
  } = useConversationMessages(
    activeThreadId
  );
const {
  sendMessage,
  sendMessageAsync,
  isSending,
} = useSendMessage({
  threadId: activeThreadId,
  recipient,
  onThreadCreated: (newThreadId) => {
    setLocalThreadId(newThreadId);
    onThreadCreated?.(newThreadId);
  },
});

  const markAsRead =
    useMarkConversationAsRead();

  useEffect(() => {
    setLocalThreadId(threadId);
  }, [threadId]);

  useEffect(() => {
    if (!threadId) return;

    markAsRead.mutate(threadId);
  }, [threadId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  const formatTime = (date) =>
    new Date(date).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

  const getMessageStatus = (message) => {
    if (!message.is_me) return null;

    if (!message.delivered) {
      return "sent";
    }

    if (message.is_read) {
      return "read";
    }

    return "delivered";
  };

  const renderStatus = (message) => {
    const status =
      getMessageStatus(message);

    if (
      status === "sent" ||
      status === "delivered"
    ) {
      return "✓";
    }

    if (status === "read") {
      return (
        <span
          style={{
            color: "#53bdeb",
          }}
        >
          ✓
        </span>
      );
    }

    return null;
  };
const sendMessageHandler = async () => {
  const trimmed = text.trim();

  if (!trimmed || isSending) {
    return;
  }

  if (!activeThreadId && !recipient?.id) {
    alert("No recipient selected");
    return;
  }

  setText("");

  try {
    await sendMessageAsync({
      content: trimmed,
      threadId: activeThreadId,
    });
  } finally {
    inputRef.current?.focus();
  }
};

  const otherUserName =
    recipient?.other_user_name ||
    recipient?.full_name ||
    messages.find(
      (message) => !message.is_me
    )?.sender?.full_name ||
    "Conversation";

  if (!threadId && !recipient) {
    return (
      <div className={styles.emptyState}>
        <p>
          Select a conversation or start a
          new chat
        </p>
      </div>
    );
  }

  if (
    isLoading &&
    messages.length === 0
  ) {
    return (
      <div className={styles.loading}>
        Loading...
      </div>
    );
  }

  if (error) {
    console.error(
      "Failed to load messages:",
      error
    );
  }

  return (
  <div className={styles.chat}>
    <div className={styles.header}>
      <div className={styles.headerLeft}>
        <button className={styles.backBtn} onClick={onBack}>
          <ArrowLeft size={20} />
        </button>

        <div className={styles.avatar}>
          {otherUserName[0]?.toUpperCase()}
        </div>

        <div>
          <div className={styles.name}>{otherUserName}</div>
        </div>
      </div>
    </div>

    <div className={styles.messages}>
      {messages.length === 0 ? (
        <div className={styles.empty}>No messages yet</div>
      ) : (
        messages.map((message) => (
          <div
            key={message.id}
            className={`${styles.row} ${
              message.is_me ? styles.me : styles.other
            }`}
          >
            <div className={styles.bubble}>
              {!message.is_me && (
                <span className={styles.sender}>
                  {message.sender?.full_name}
                </span>
              )}

              <div className={styles.text}>{message.content}</div>

              <div className={styles.meta}>
                <span>{formatTime(message.created_at)}</span>
                {message.is_me && renderStatus(message)}
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
        onChange={(event) => setText(event.target.value)}
        placeholder="Type message..."
        disabled={isSending}
        onKeyDown={(event) => {
          if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            sendMessageHandler();
          }
        }}
      />
      <button
        className={styles.sendBtn}
        onClick={sendMessageHandler}
        disabled={isSending || !text.trim()}
      >
        {isSending ? "Sending..." : "Send"}
      </button>
    </div>
  </div>
);
}