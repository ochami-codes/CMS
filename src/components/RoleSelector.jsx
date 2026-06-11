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

  const toggleRole = (roleName) => {
    if (multiple) {
      onChange(
        selectedRoles.includes(roleName)
          ? selectedRoles.filter((r) => r !== roleName)
          : [...selectedRoles, roleName]
      );
    } else {
      onChange([roleName]);
    }
  };

  if (loading) {
    return <Loader message="Loading roles..." />;
  }

  return (
    <div className={styles.roleList}>
      {roles.map((role) => {
        const selected = selectedRoles.includes(role.name);

        return (
          <label
            key={role.id}
            className={`${styles.roleItem} ${
              selected ? styles.selected : ""
            }`}
            onClick={() => toggleRole(role.name)}
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