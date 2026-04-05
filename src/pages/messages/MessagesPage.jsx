import { useState } from "react";
import InboxList from "./InboxList";
import ChatWindow from "./ChatWindow";
import NewMessageModal from "./NewMessageModal";
import "../../styles/messages.css";

export default function MessagesPage() {
  const [selectedThread, setSelectedThread] = useState(null);
  const [selectedRecipient, setSelectedRecipient] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // When user selects a leader/person from modal
  const handleRecipientSelect = (user) => {
    setSelectedRecipient(user);   // { id, name }
    setSelectedThread(null);      // new conversation
    setShowModal(false);
  };

  return (
    <div className="messages-container">
      {/* Sidebar */}
      <div className="messages-sidebar">
        <div className="messages-header">
          <h3>Messages</h3>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            + New
          </button>
        </div>

        <InboxList
          onSelect={(threadId) => {
            setSelectedThread(threadId);
            setSelectedRecipient(null); // existing thread overrides new recipient
          }}
          activeThreadId={selectedThread}
        />
      </div>

      {/* Chat Area */}
      <div className="messages-content">
        <ChatWindow
          threadId={selectedThread}
          recipient={selectedRecipient}
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
