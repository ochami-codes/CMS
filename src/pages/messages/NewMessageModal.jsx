import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import useMessageUsers from "../../hooks/messages/useMessageUsers";

import styles from "../../styles/messages/NewMessageModal.module.css";

export default function NewMessageModal({
  onSelect,
  onClose,
}) {

  const [search, setSearch] = useState("");

  const {
    data: groups = [],
    isLoading,
    error,
  } = useMessageUsers();

  const filteredGroups = useMemo(() => {
    const query = search
      .trim()
      .toLowerCase();

    if (!query) {
      return groups;
    }

    return groups
      .map((group) => ({
        ...group,

        users: group.users.filter(
          (user) =>
            user.full_name
              .toLowerCase()
              .includes(query)
        ),
      }))
      .filter(
        (group) =>
          group.users.length > 0
      );
  }, [groups, search]);

  if (error) {
    console.error(
      "Failed to load message users:",
      error
    );
  }

  return (
    <motion.div
      className={styles.overlay}
      onClick={onClose}
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 1,
      }}
      exit={{
        opacity: 0,
      }}
    >
      <motion.div
        className={styles.modal}
        onClick={(event) =>
          event.stopPropagation()
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
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder="Search people..."
          />
        </div>

        {/* List */}

        <div className={styles.list}>
          {isLoading ? (
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
                  key={`${group.type}-${group.role}-${index}`}
                >
                  <h4
                    className={
                      styles.groupTitle
                    }
                  >
                    {group.type === "leaders"
                      ? group.role_label
                      : "Members"}
                  </h4>

                  {group.users.map(
                    (user) => (
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

                        <div
                          className={
                            styles.name
                          }
                        >
                          {user.full_name}
                        </div>
                      </div>
                    )
                  )}
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