// src/pages/messages/NewMessageModal.jsx
import { ROLES, getRoleLabel } from "../../config/roles";
import "../../styles/messages.css";

export default function NewMessageModal({ onSelect, onClose }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <h3>Select Role to Message</h3>

        <div className="role-list">
          {Object.values(ROLES)
            .filter((r) => r.key !== "member") // skip generic members
            .map((role) => (
              <div
                key={role.key}
                className="role-item"
                onClick={() => {
                  onSelect(role.key); // select role immediately
                  onClose();          // close modal
                }}
              >
                {getRoleLabel(role.label)}
              </div>
            ))}
        </div>

        <div className="modal-info">
          <small>Click a role to start a chat</small>
        </div>
      </div>
    </div>
  );
}
