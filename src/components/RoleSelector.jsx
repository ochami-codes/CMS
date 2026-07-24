import { useAuth } from "../context/AuthContext";
import Loader from "./Loader";
import styles from "../styles/components/RoleSelector.module.css";

export default function RoleSelector({
  roles = [],
  selectedRoles = [],
  onChange,
  loading = false,
  multiple = true,
}) {
  const { getRoleLabel } = useAuth();

  // Admin is protected and cannot be assigned through this selector
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

  if (loading) {
    return <Loader message="Loading roles..." />;
  }

  return (
    <div className={styles.roleList}>
      {assignableRoles.map((role) => {
        const selected = selectedRoles.includes(
          role.name
        );

        return (
          <label
            key={role.id}
            className={`${styles.roleItem} ${
              selected ? styles.selected : ""
            }`}
            onClick={() =>
              toggleRole(role.name)
            }
          >
            <span className={styles.roleName}>
              {getRoleLabel(role.name)}
            </span>

            <div
              className={`${styles.check} ${
                selected ? styles.checked : ""
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