import { useEffect, useState, useMemo } from "react";
import { MessagesAPI } from "../../utils/api";
import { useAuth } from "../../context/AuthContext";
import "../../styles/messages.css";

export default function NewMessageModal({ onSelect, onClose }) {
  const { getRoleLabel } = useAuth();

  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  // -----------------------------
  // Load users (leaders + members)
  // -----------------------------
  const loadUsers = async () => {
    try {
      setLoading(true);

      const res = await MessagesAPI.getUsers();

      const normalized = Array.isArray(res.groups)
        ? res.groups.map((group) => ({
            ...group,
            users: (group.users || []).map((user) => ({
              ...user,
              full_name:
                user.full_name ?? user.name ?? "Unknown",
            })),
          }))
        : [];

      setGroups(normalized);
    } catch (err) {
      console.error("Failed to load users:", err);
      setGroups([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  // -----------------------------
  // Filter users
  // -----------------------------
  const filteredGroups = useMemo(() => {
    const q = search.toLowerCase();

    return groups
      .map((group) => ({
        ...group,
        users: group.users.filter((user) =>
          user.full_name.toLowerCase().includes(q)
        ),
      }))
      .filter((group) => group.users.length > 0);
  }, [groups, search]);

  // -----------------------------
  // UI
  // -----------------------------
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-card"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="modal-header">
          <h3>Church members</h3>
        </div>

        {/* Search */}
        <div className="modal-search">
          <input
            type="text"
            placeholder="Search people..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />
        </div>

        {/* Body */}
        <div className="modal-body">
          {loading ? (
            <p className="modal-info">
              Loading users...
            </p>
          ) : filteredGroups.length === 0 ? (
            <p className="modal-info">
              {search
                ? "No results found"
                : "No users available"}
            </p>
          ) : (
            <div className="role-group-list">
              {filteredGroups.map((group, index) => (
                <div
                  key={`${group.type}-${group.role}-${index}`}
                  className="role-group"
                >
                  {/* Title */}
                  <h4 className="role-title">
                    {group.type === "leaders"
                      ? getRoleLabel(group.role)
                      : "Members"}
                  </h4>

                  {/* Users */}
                  <div className="role-users">
                    {group.users.map((user) => (
                      <div
                        key={user.id}
                        className="role-user"
                        onClick={() =>
                          onSelect(user)
                        }
                      >
                        <div className="avatar">
                          {user.full_name
                            ?.charAt(0)
                            ?.toUpperCase() || "U"}
                        </div>

                        <div className="user-info">
                          <span className="user-name">
                            {user.full_name}
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
          <button
            className="btn btn-secondary"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
