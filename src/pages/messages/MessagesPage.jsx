import { useEffect, useState } from "react";
import InboxList from "./InboxList";
import ChatWindow from "./ChatWindow";
import NewMessageModal from "./NewMessageModal";
import { MessagesAPI } from "../../utils/api";
import "../../styles/messages.css";
import { useAuth } from "../../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";

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
  const [view, setView] = useState("inbox"); // inbox | chat

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

    setView("chat");

    // Mark as read if needed
    if (thread.unread_count > 0) {
      // Optimistic UI update
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
        loadInbox(); // rollback
      }
    }
  };

  const handleBack = () => {
    setView("inbox");
  };

  const handleRecipientSelect = (user) => {
    setActiveRecipient({
      id: user.id,
      full_name: user.full_name,
    });

    setActiveThreadId(null);
    setShowModal(false);
    setView("chat");
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
      {/* ================= SIDEBAR (INBOX) ================= */}
      <AnimatePresence mode="wait">
        {view === "inbox" && (
          <motion.div
            key="inbox"
            className="messages-sidebar"
            initial={{ x: 0, opacity: 1 }}
            exit={{ x: -50, opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <div className="messages-header">
              <h3>Message your leaders and other church members</h3>

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
          </motion.div>
        )}
      </AnimatePresence>

      {/* ================= CHAT ================= */}
      <AnimatePresence mode="wait">
        {view === "chat" && (
          <motion.div
            key="chat"
            className="messages-content"
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 100, opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <ChatWindow
              threadId={activeThreadId}
              recipient={activeRecipient}
              onThreadCreated={handleThreadCreated}
              onMessageSent={loadInbox}
              onBack={handleBack}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ================= MODAL ================= */}
      <AnimatePresence>
  {showModal && (
    <NewMessageModal
      onSelect={handleRecipientSelect}
      onClose={() => setShowModal(false)}
    />
  )}
</AnimatePresence>
  </div>
  );
}
