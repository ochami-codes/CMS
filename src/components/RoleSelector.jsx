import { useAuth } from "../context/AuthContext";
import Loader from "./Loader";
import styles from "../styles/components/RoleSelector.module.css";

export default function RoleSelector({
  roles = [],
  selectedRoles = [],
  primaryRole = "",
  onChange,
  onPrimaryRoleChange,
  loading = false,
  multiple = true,
}) {
  const { getRoleLabel } = useAuth();

  const toggleRole = (roleName) => {
    if (!multiple) {
      onChange([roleName]);
      onPrimaryRoleChange?.(roleName);
      return;
    }

    let nextRoles;

    if (selectedRoles.includes(roleName)) {
      nextRoles = selectedRoles.filter(
        (r) => r !== roleName
      );
    } else {
      nextRoles = [
        ...selectedRoles,
        roleName,
      ];
    }

    onChange(nextRoles);

    if (
      !nextRoles.includes(primaryRole)
    ) {
      onPrimaryRoleChange?.(
        nextRoles[0] || ""
      );
    }
  };

  if (loading) {
    return (
      <Loader message="Loading roles..." />
    );
  }

  return (
    <>
      <div className={styles.roleList}>
        {roles.map((role) => {
          const selected =
            selectedRoles.includes(
              role.name
            );

          return (
            <label
              key={role.id}
              className={`${styles.roleItem} ${
                selected
                  ? styles.selected
                  : ""
              }`}
              onClick={() =>
                toggleRole(role.name)
              }
            >
              <span
                className={
                  styles.roleName
                }
              >
                {getRoleLabel(
                  role.name
                )}
              </span>

              <div
                className={`${
                  styles.check
                } ${
                  selected
                    ? styles.checked
                    : ""
                }`}
              >
                {selected ? "✓" : ""}
              </div>
            </label>
          );
        })}
      </div>

      {multiple &&
        selectedRoles.length >
          0 && (
          <div
            className={
              styles.primaryRoleSection
            }
          >
            <label>
              Primary Role
            </label>

            <select
              value={primaryRole}
              onChange={(e) =>
                onPrimaryRoleChange?.(
                  e.target.value
                )
              }
              className={
                styles.primaryRoleSelect
              }
            >
              {selectedRoles.map(
                (role) => (
                  <option
                    key={role}
                    value={role}
                  >
                    {getRoleLabel(
                      role
                    )}
                  </option>
                )
              )}
            </select>
          </div>
        )}
    </>
  );
}