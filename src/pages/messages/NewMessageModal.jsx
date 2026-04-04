// src/pages/messages/NewMessageModal.jsx
import { useState } from "react";
import { ROLES, getRoleLabel } from "../../config/roles";
import "../../styles/messages.css";

export default function NewMessageModal({ onSelect, onClose }) {
  const [selectedRole, setSelectedRole] = useState(null);

  const handleConfirm = () => {
    if (!selectedRole) return;
    onSelect(selectedRole);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <h3>Select Role to Message</h3>

        <div className="role-list">
          {Object.values(ROLES)
            .filter((r) => r.key !== "member") // optional: skip generic members
            .map((role) => (
              <div
                key={role.key}
                className={`role-item ${selectedRole === role.key ? "selected" : ""}`}
                onClick={() => setSelectedRole(role.key)}
              >
                {getRoleLabel(role.key)}
              </div>
            ))}
        </div>

        <div className="modal-actions">
          <button className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button
            className="btn btn-primary"
            onClick={handleConfirm}
            disabled={!selectedRole}
          >
            Start Chat
          </button>
        </div>
      </div>
    </div>
  );
}
