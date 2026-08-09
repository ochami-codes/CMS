import Loader from "./Loader";
import { useRoles } from "../hooks/admin/useRoles";
import styles from "../styles/components/RoleSelector.module.css";

export default function RoleSelector({
  selectedRoles = [],
  onChange,
  multiple = true,
}) {
  const {
    roles,
    isLoading,
    isError,
  } = useRoles();

  // Admin is protected and cannot be assigned
  // through this selector
  const assignableRoles = roles.filter(
    (role) => role.name !== "admin"
  );

  const toggleRole = (roleName) => {
    if (!multiple) {
      onChange([roleName]);
      return;
    }

    if (selectedRoles.includes(roleName)) {
      onChange(
        selectedRoles.filter(
          (role) => role !== roleName
        )
      );
    } else {
      onChange([
        ...selectedRoles,
        roleName,
      ]);
    }
  };

  if (isLoading) {
    return (
      <Loader message="Loading roles..." fullScreen={false} />
    );
  }

  if (isError) {
    return (
      <p className={styles.error}>
        Failed to load roles.
      </p>
    );
  }

  return (
    <div className={styles.roleList}>
      {assignableRoles.map((role) => {
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
              className={styles.roleName}
            >
              {role.label ?? role.name}
            </span>

            <div
              className={`${styles.check} ${
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
  );
}