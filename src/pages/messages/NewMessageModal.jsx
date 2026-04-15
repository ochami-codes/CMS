import { useEffect, useState, useMemo } from "react";
import { MessagesAPI } from "../../utils/api";
import { useAuth } from "../../context/AuthContext";
import "../../styles/messages.css";

export default function NewMessageModal({ onSelect, onClose }) {
  const { getRoleLabel } = useAuth();

  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  // -----------------------------
  // Load leaders
  // -----------------------------
const loadLeaders = async () => {
  try {
    setLoading(true);
    const res = await MessagesAPI.getLeaders();

    const normalized = Array.isArray(res.roles)
      ? res.roles.map((group) => ({
          ...group,
          users: (group.users || []).map((user) => ({
            ...user,
            full_name: user.full_name ?? user.name ?? "Unknown"
          })),
        }))
      : [];

    setLeaders(normalized);
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
  // -----------------------------
  // Filter leaders
  // -----------------------------
  const filteredLeaders = useMemo(() => {
    const q = search.toLowerCase();

    return leaders
      .map((group) => ({
        ...group,
        users: (group.users || []).filter((user) =>
          (user.full_name || "").toLowerCase().includes(q)
        ),
      }))
      .filter((group) => group.users.length > 0);
  }, [leaders, search]);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <h3>Church leaders in your church</h3>
        </div>

        {/* Search */}
        <div className="modal-search">
          <input
            type="text"
            placeholder="Search leaders..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Body */}
        <div className="modal-body">
          {loading ? (
            <p className="modal-info">Loading leaders...</p>
          ) : filteredLeaders.length === 0 ? (
            <p className="modal-info">
              {search ? "No results found" : "No leaders available"}
            </p>
          ) : (
            <div className="role-group-list">
              {filteredLeaders.map((group, index) => (
                <div
                  key={`${group.role}-${index}`}
                  className="role-group"
                >
                  <h4 className="role-title">
                    {getRoleLabel(group.role)}
                  </h4>

                  <div className="role-users">
                    {group.users.map((user) => (
                      <div
                        key={user.id}
                        className="role-user"
                        onClick={() => onSelect(user)}
                      >
                        <div className="avatar">
                          {user.full_name?.charAt(0)?.toUpperCase() || "U"}
                        </div>

                        <div className="user-info">
                          <span className="user-name">
                            {user.full_name || "Unknown"}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="modal-actions">
          <button className="btn btn-secondary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
