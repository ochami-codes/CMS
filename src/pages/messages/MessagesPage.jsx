// src/pages/messages/MessagesPage.jsx
import { useState } from "react";
import InboxList from "./InboxList";
import ChatWindow from "./ChatWindow";
import NewMessageModal from "./NewMessageModal";
import "../../styles/messages.css";

export default function MessagesPage() {
  const [selectedThread, setSelectedThread] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // When user selects a role to message
  const handleRoleSelect = (roleKey) => {
    setSelectedRole(roleKey);
    setSelectedThread(null); // new conversation
    setShowModal(false);
  };

  return (
    <div className="messages-container">
      {/* Sidebar */}
      <div className="messages-sidebar">
        <div className="messages-header">
          <h3>Messages</h3>

          <button
            className="btn btn-primary"
            onClick={() => setShowModal(true)}
          >
            + New
          </button>
        </div>

        <InboxList
          onSelect={(threadId) => {
            setSelectedThread(threadId);
            setSelectedRole(null); // existing thread overrides role
          }}
          activeThreadId={selectedThread}
        />
      </div>

      {/* Chat Area */}
      <div className="messages-content">
        <ChatWindow
          threadId={selectedThread}
          targetRole={selectedRole} // 👈 NEW
        />
      </div>

      {/* Role Selection Modal */}
      {showModal && (
        <NewMessageModal
          onSelect={handleRoleSelect}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}
