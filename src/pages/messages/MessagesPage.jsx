import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import InboxList from "./InboxList";
import ChatWindow from "./ChatWindow";
import NewMessageModal from "./NewMessageModal";

import useInbox from "../../hooks/messages/useInbox";
import useMarkThreadAsRead from "../../hooks/messages/useMarkThreadAsRead";
import useThreadWithUser from "../../hooks/messages/useThreadWithUser";

import styles from "../../styles/messages/MessagesPage.module.css";

export default function MessagesPage() {
  const [activeThreadId, setActiveThreadId] = useState(null);
  const [activeRecipient, setActiveRecipient] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [view, setView] = useState("inbox");

  const {
    data: inbox = [],
    isLoading,
    error,
  } = useInbox();

  const markThreadAsRead = useMarkThreadAsRead();
  const { getThreadWithUser, isLoadingUser } = useThreadWithUser();

  const handleSelectThread = async (thread) => {
    setActiveThreadId(thread.thread_id);
    setActiveRecipient({
      id: thread.other_user_id,
      full_name: thread.other_user_name,
    });
    setView("chat");

    if (thread.unread_count > 0) {
      try {
        await markThreadAsRead.mutateAsync(thread.thread_id);
      } catch (err) {
        console.error("Failed to mark thread as read:", err);
      }
    }
  };

  const handleNewMessage = async (user) => {
    try {
      const response = await getThreadWithUser(user.id);
      setActiveRecipient(user);
      setActiveThreadId(response?.threadId || null);
      setView("chat");
      setShowModal(false);
    } catch (err) {
      console.error("Failed to get conversation:", err);
    }
  };

  const handleNewChat = () => {
    setActiveThreadId(null);
    setActiveRecipient(null);
    setShowModal(true);
  };

  const handleBack = () => {
    setView("inbox");
  };

  if (error) {
    console.error("Failed to load inbox:", error);
  }

  return (
    <div className={styles.page}>
      {/* Inbox */}
      <AnimatePresence mode="wait">
        {view === "inbox" && (
          <motion.div
            className={styles.sidebar}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className={styles.sidebarHeader}>
              <h3 className={styles.title}>Message leaders and members</h3>
              <button
                className={`btn btn-primary ${styles.newBtn}`}
                onClick={handleNewChat}
              >
                + New
              </button>
            </div>

            <div className={styles.inbox}>
              {isLoading ? (
                <p>Loading inbox...</p>
              ) : (
                <InboxList
                  inbox={inbox}
                  activeThreadId={activeThreadId}
                  onSelect={handleSelectThread}
                />
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat */}
      <AnimatePresence mode="wait">
        {view === "chat" && (
          <motion.div
            className={styles.content}
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 50, opacity: 0 }}
          >
            {isLoadingUser ? (
              <p>Loading conversation...</p>
            ) : (
              <ChatWindow
                threadId={activeThreadId}
                recipient={activeRecipient}
                onThreadCreated={setActiveThreadId}
                onBack={handleBack}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* New Message Modal */}
      {showModal && (
        <div className={styles.modalOverlay}>
          <NewMessageModal
            onClose={() => setShowModal(false)}
            onSelect={handleNewMessage}
          />
        </div>
      )}
    </div>
  );
}
