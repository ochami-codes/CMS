import { useEffect, useState, useMemo } from "react";
import { MessagesAPI } from "../../utils/api";
import { useAuth } from "../../context/AuthContext";
import { motion } from "framer-motion";
import "../../styles/messages.css";

export default function NewMessageModal({ onSelect, onClose }) {
  const { getRoleLabel } = useAuth();
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const loadUsers = async () => {
    try {
      setLoading(true);
      const res = await MessagesAPI.getUsers();
      const normalized = Array.isArray(res.groups)
        ? res.groups.map((group) => ({
            ...group,
            users: (group.users || []).map((user) => ({
              ...user,
              full_name: user.full_name ?? user.name ?? "Unknown",
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

  return (
    <motion.div
      className="modal"
      onClick={onClose}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <motion.div
        className="modal"
        onClick={(e) => e.stopPropagation()}
        initial={{ scale: 0.95, y: 40, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.95, y: 40, opacity: 0 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
      >
        {/* Header */}
        <div className="header">
          <h3 className="title">Start a conversation</h3>
        </div>

        {/* Search */}
        <div className="modalSearch">
          <input
            type="text"
            placeholder="Search people..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Body */}
        <div className="modalList">
          {loading ? (
            <p className="empty">Loading users...</p>
          ) : filteredGroups.length === 0 ? (
            <p className="empty">
              {search ? "No results found" : "No users available"}
            </p>
          ) : (
            filteredGroups.map((group, index) => (
              <div key={`${group.type}-${group.role}-${index}`}>
                <h4 className="title" style={{ padding: "0.75rem 1rem 0" }}>
                  {group.type === "leaders"
                    ? getRoleLabel(group.role)
                    : "Members"}
                </h4>

                {group.users.map((user) => (
                  <div
                    key={user.id}
                    className="thread"
                    onClick={() => onSelect(user)}
                  >
                    <div className="avatar">
                      {user.full_name?.charAt(0)?.toUpperCase() || "U"}
                    </div>

                    <div className="threadBody">
                      <div className="threadTop">
                        <span className="name">{user.full_name}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div style={{ padding: "1rem", borderTop: "1px solid var(--border)" }}>
          <button className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
