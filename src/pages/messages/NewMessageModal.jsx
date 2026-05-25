import { useEffect, useState, useMemo } from "react";
import { MessagesAPI } from "../../utils/api";
import { useAuth } from "../../context/AuthContext";
import { motion } from "framer-motion";

import styles from "../../styles/messages/NewMessageModal.module.css";

export default function NewMessageModal({
  onSelect,
  onClose,
}) {
  const { getRoleLabel } = useAuth();

  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const loadUsers = async () => {
    try {
      setLoading(true);

      const res =
        await MessagesAPI.getUsers();

      const normalized =
        Array.isArray(res.groups)
          ? res.groups.map(group => ({
              ...group,
              users: (group.users || []).map(
                user => ({
                  ...user,
                  full_name:
                    user.full_name ??
                    user.name ??
                    "Unknown",
                })
              ),
            }))
          : [];

      setGroups(normalized);

    } catch (err) {
      console.error(err);
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
      .map(group => ({
        ...group,
        users: group.users.filter(user =>
          user.full_name
            .toLowerCase()
            .includes(q)
        ),
      }))
      .filter(g => g.users.length > 0);

  }, [groups, search]);


  return (

    <motion.div
      className={styles.overlay}
      onClick={onClose}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >

      <motion.div
        className={styles.modal}
        onClick={e =>
          e.stopPropagation()
        }
        initial={{
          scale: 0.95,
          y: 30,
          opacity: 0,
        }}
        animate={{
          scale: 1,
          y: 0,
          opacity: 1,
        }}
        exit={{
          scale: 0.95,
          y: 30,
          opacity: 0,
        }}
      >

        {/* Header */}
        <div className={styles.header}>
          <h3 className={styles.title}>
            Start a conversation
          </h3>
        </div>


        {/* Search */}
        <div className={styles.search}>
          <input
            value={search}
            onChange={e =>
              setSearch(e.target.value)
            }
            placeholder="Search people..."
          />
        </div>


        {/* List */}
        <div className={styles.list}>

          {loading ? (
            <p className={styles.empty}>
              Loading users...
            </p>

          ) : filteredGroups.length === 0 ? (
            <p className={styles.empty}>
              {search
                ? "No results found"
                : "No users available"}
            </p>

          ) : (

            filteredGroups.map(
              (group, index) => (

                <div
                  key={`${group.type}-${
                    group.role
                  }-${index}`}
                >

                  <h4
                    className={
                      styles.groupTitle
                    }
                  >
                    {group.type === "leaders"
                      ? getRoleLabel(
                          group.role
                        )
                      : "Members"}
                  </h4>


                  {group.users.map(user => (

                    <div
                      key={user.id}
                      className={
                        styles.userRow
                      }
                      onClick={() =>
                        onSelect(user)
                      }
                    >

                      <div
                        className={
                          styles.avatar
                        }
                      >
                        {user.full_name
                          ?.charAt(0)
                          ?.toUpperCase() ||
                          "U"}
                      </div>


                      <div className={styles.name}>
                        {user.full_name}
                      </div>

                    </div>

                  ))}

                </div>

              )

            )

          )}

        </div>


        {/* Footer */}
        <div className={styles.footer}>
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
