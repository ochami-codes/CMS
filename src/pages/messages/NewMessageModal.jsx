// src/components/messages/NewMessageModal.jsx
import { useEffect, useState } from "react";
import { MessagesAPI } from "../../utils/api";
import { useAuth } from "../../context/AuthContext";
import "../../styles/messages.css";

export default function NewMessageModal({ onSelect, onClose }) {
  const { getRoleLabel } = useAuth(); // use backend-driven helper
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadLeaders = async () => {
    try {
      setLoading(true);
      const res = await MessagesAPI.getLeaders();

      // Safety: ensure it's always an array
      setLeaders(Array.isArray(res.roles) ? res.roles : []);
    } catch (err) {
      console.error("Failed to load leaders:", err);
      setLeaders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLeaders();
  }, []);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Select Leader</h3>
        </div>

        {/* STATES */}
        {loading ? (
          <p className="modal-info">Loading leaders...</p>
        ) : leaders.length === 0 ? (
          <p className="modal-info">No leaders available</p>
        ) : (
          <div className="role-group-list">
            {leaders.map((group) => (
              <div key={group.role} className="role-group">
                {/* ✅ Use backend-driven label */}
                <h4 className="role-title">
                  {getRoleLabel(group.role)}
                </h4>

                <div className="role-users">
                  {(group.users || []).map((user) => (
                    <div
                      key={user.id}
                      className="role-user"
                      onClick={() => {
                        onSelect(user); // { id, name }
                        onClose();
                      }}
                    >
                      <span className="user-name">
                        {user.name || "Unknown"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* FOOTER */}
        <div className="modal-actions">
          <button className="btn btn-secondary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
