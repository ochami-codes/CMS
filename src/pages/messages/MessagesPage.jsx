import { useEffect, useState } from "react";
import InboxList from "./InboxList";
import ChatWindow from "./ChatWindow";
import NewMessageModal from "./NewMessageModal";
import { MessagesAPI } from "../../utils/api";
import "../../styles/messages.css";
import { useAuth } from "../../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";

export default function MessagesPage() {
  const { user } = useAuth();
  const currentProfileId = user?.id;

  const [activeThreadId, setActiveThreadId] = useState(null);
  const [activeRecipient, setActiveRecipient] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [inbox, setInbox] = useState([]);
  const [view, setView] = useState("inbox"); // inbox | chat

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

  const handleSelectThread = async (thread) => {
    setActiveThreadId(thread.thread_id);
    setActiveRecipient({
      id: thread.other_user_id,
      full_name: thread.other_user_name,
    });
    setView("chat");

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

  const handleBack = () => {
    setView("inbox");
  };

  const handleRecipientSelect = async (user) => {
    try {
      const res = await MessagesAPI.getThreadWith(user.id);
      setActiveRecipient({
        id: user.id,
        full_name: user.full_name,
      });

      if (res.thread_id) {
        setActiveThreadId(res.thread_id);
      } else {
        setActiveThreadId(null);
      }

      setShowModal(false);
      setView("chat");
    } catch (err) {
      console.error("Failed to check thread:", err);
    }
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

  return (
    <div className="messages">
      {/* Sidebar / Inbox */}
      <AnimatePresence mode="wait">
        {view === "inbox" && (
          <motion.div
            key="inbox"
            className="sidebar"
            initial={{ x: 0, opacity: 1 }}
            exit={{ x: -50, opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <div className="header">
              <h3 className="title">
                Message your leaders and other church members
              </h3>

              <button className="btn btn-primary" onClick={openNewMessageModal}>
                + New
              </button>
            </div>

            <div className="inbox">
              <InboxList
                inbox={inbox}
                activeThreadId={activeThreadId}
                onSelect={handleSelectThread}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat */}
      <AnimatePresence mode="wait">
        {view === "chat" && (
          <motion.div
            key="chat"
            className="content"
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

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="modal">
            <NewMessageModal
              onSelect={handleRecipientSelect}
              onClose={() => setShowModal(false)}
            />
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
