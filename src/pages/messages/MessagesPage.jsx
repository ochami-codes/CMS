import { useEffect, useState } from "react";
import InboxList from "./InboxList";
import ChatWindow from "./ChatWindow";
import NewMessageModal from "./NewMessageModal";
import { MessagesAPI } from "../../utils/api";
import "../../styles/messages.css";
import { useAuth } from "../../context/AuthContext";

export default function MessagesPage() {
  // -----------------------------
  // Auth
  // -----------------------------
  const { user } = useAuth();
  const currentProfileId = user?.id;

  // -----------------------------
  // State
  // -----------------------------
  const [activeThreadId, setActiveThreadId] = useState(null);
  const [activeRecipient, setActiveRecipient] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [inbox, setInbox] = useState([]);

  // -----------------------------
  // Load Inbox
  // -----------------------------
  const loadInbox = async () => {
    try {
      const res = await MessagesAPI.getInbox();
      setInbox(Array.isArray(res.inbox) ? res.inbox : []);
    } catch (err) {
      console.error("Failed to load inbox:", err);
    }
  };

  useEffect(() => {
    loadInbox();
  }, []);

  // -----------------------------
  // Handlers
  // -----------------------------

  const handleSelectThread = async (thread) => {
    setActiveThreadId(thread.thread_id);

    setActiveRecipient({
      id: thread.other_user_id,
      full_name: thread.other_user_name,
    });

    if (thread.unread_count > 0) {
      setInbox((prev) =>
        prev.map((item) =>
          item.thread_id === thread.thread_id
            ? { ...item, unread_count: 0 }
            : item
        )
      );

      try {
        await MessagesAPI.markAsRead(thread.thread_id);
      } catch (err) {
        console.error("Failed to mark as read:", err);
        loadInbox();
      }
    }
  };

  const handleRecipientSelect = (user) => {
    setActiveRecipient({
      id: user.id,
      full_name: user.full_name,
    });

    setActiveThreadId(null);
    setShowModal(false);
  };

  const handleThreadCreated = (threadId) => {
    setActiveThreadId(threadId);
    setActiveRecipient(null);
    loadInbox();
  };

  const openNewMessageModal = () => {
    setActiveThreadId(null);
    setActiveRecipient(null);
    setShowModal(true);
  };

  // -----------------------------
  // UI
  // -----------------------------
  return (
    <div className="messages-container">
      {/* Sidebar */}
      <div className="messages-sidebar">
        <div className="messages-header">
          <h3>Message your leaders</h3>

          <button
            className="btn btn-primary"
            onClick={openNewMessageModal}
          >
            + New
          </button>
        </div>

        <InboxList
          inbox={inbox}
          activeThreadId={activeThreadId}
          onSelect={handleSelectThread}
        />
      </div>

      {/* Chat Area */}
      <div className="messages-content">
        <ChatWindow
          threadId={activeThreadId}
          recipient={activeRecipient}
          onThreadCreated={handleThreadCreated}
          onMessageSent={loadInbox}
        />
      </div>

      {/* Modal */}
      {showModal && (
        <NewMessageModal
          onSelect={handleRecipientSelect}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}
