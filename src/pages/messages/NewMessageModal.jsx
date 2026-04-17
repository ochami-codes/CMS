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

  // -----------------------------
  // Load users
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
    <motion.div
      className="modal-overlay"
      onClick={onClose}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <motion.div
        className="modal-card"
        onClick={(e) => e.stopPropagation()}
        initial={{ scale: 0.95, y: 40, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.95, y: 40, opacity: 0 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
      >
        {/* Header */}
        <div className="modal-header">
          <h3>Start a conversation</h3>
          <p className="modal-subtitle">
            Select a member or leader to begin chatting
          </p>
        </div>

        {/* Search */}
        <div className="modal-search">
          <input
            type="text"
            placeholder="Search people..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Body */}
        <div className="modal-body">
          {loading ? (
            <p className="modal-info">Loading users...</p>
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
                  <motion.div
                    className="role-users"
                    initial="hidden"
                    animate="visible"
                    variants={{
                      hidden: {},
                      visible: {
                        transition: {
                          staggerChildren: 0.04,
                        },
                      },
                    }}
                  >
                    {group.users.map((user) => (
                      <motion.div
                        key={user.id}
                        className="role-user"
                        onClick={() => onSelect(user)}
                        variants={{
                          hidden: { opacity: 0, y: 10 },
                          visible: { opacity: 1, y: 0 },
                        }}
                        whileTap={{ scale: 0.97 }}
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
                      </motion.div>
                    ))}
                  </motion.div>
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
            Cancel
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
