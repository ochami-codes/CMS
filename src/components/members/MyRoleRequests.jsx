// src/components/members/MyRoleRequests.jsx

import { useMemo, useState } from "react";
import { Shield } from "lucide-react";

import { useAuth } from "../../context/AuthContext";
import { useRoles } from "../../hooks/admin/useRoles";
import { useMyRoleRequests } from "../../hooks/members/useMyRoleRequests";

import Card from "../Card";
import RoleSelector from "../RoleSelector";

import styles from "../../styles/components/MyRoleRequests.module.css";

export default function MyRoleRequests() {
  const { user, getRoleLabel } = useAuth();
  const { roles, loading: rolesLoading } = useRoles();
  const {
    requests,
    loading,
    submitting,
    submitRequest,
  } = useMyRoleRequests(user?.id);

  const [selectedRole, setSelectedRole] = useState([]);

  const availableRoles = useMemo(
    () => roles.filter((role) => role.name !== "admin"),
    [roles]
  );

  const handleSubmit = async () => {
    const role = selectedRole[0];
    if (!role) return;

    try {
      await submitRequest(role);
      setSelectedRole([]);
    } catch (error) {
      console.error(error);
    }
  };

  const statusClass = (status) => {
    switch (status) {
      case "approved":
        return styles.statusSuccess;
      case "rejected":
        return styles.statusDanger;
      default:
        return styles.statusWarning;
    }
  };

  if (loading || rolesLoading) {
    return <Card title="Role Requests">Loading requests...</Card>;
  }

  return (
    <div className={styles.container}>
      <Card
        title="Role Requests"
        subtitle="Request additional permissions within your church"
        icon={<Shield size={18} />}
      />

      <Card title="Request New Role">
        <div className={styles.formGroup}>
          <RoleSelector
            roles={availableRoles}
            selectedRoles={selectedRole}
            onChange={setSelectedRole}
            multiple={false}
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={!selectedRole.length || submitting}
          className={styles.btnPrimary}
        >
          {submitting ? "Submitting..." : "Send Request"}
        </button>
      </Card>

      <Card title="My Requests">
        {!requests.length ? (
          <p className={styles.textMuted}>No role requests yet</p>
        ) : (
          <div className={styles.list}>
            {requests.map((request) => (
              <div
                key={request.id}
                className={`${styles.listItem} ${styles.flexBetween}`}
              >
                <div>
                  <div className={styles.roleName}>
                    {getRoleLabel(request.requested_role)}
                  </div>
                  <small className={styles.textMuted}>
                    {new Date(request.role_requested_at).toLocaleDateString()}
                  </small>
                </div>

                <span className={`${styles.statusLabel} ${statusClass(request.role_request_status)}`}>
                  {request.role_request_status}
                </span>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
