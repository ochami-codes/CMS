// src/components/members/MyRoleRequests.jsx
import { useMemo, useState } from "react";
import { Shield } from "lucide-react";

import { useAuth } from "../../context/AuthContext";
import { useRoles } from "../../hooks/admin/useRoles";
import { useMyRoleRequests } from "../../hooks/members/useMyRoleRequests";

import Card from "../Card";
import RoleSelector from "../RoleSelector";
import BadgeList from "../BadgeList";
import TextDisplay from "../TextDisplay";
import Loader from "../Loader";

import styles from "../../styles/components/MyRoleRequests.module.css";

export default function MyRoleRequests() {
  const { user } = useAuth();
  const { roles, isLoading: rolesLoading } = useRoles();
  const { requests, loading, submitting, submitRequest } = useMyRoleRequests(user?.id);

  const [selectedRole, setSelectedRole] = useState([]);

  // -----------------------------------------
  // Current User Roles
  // -----------------------------------------
  const currentRoleNames = useMemo(
    () => (user?.activeChurch?.roles ?? []).map((role) => role.name),
    [user]
  );

  // -----------------------------------------
  // Available Roles (exclude admin + existing)
  // -----------------------------------------
  const availableRoles = useMemo(
    () =>
      roles.filter(
        (role) =>
          role.name !== "admin" &&
          !currentRoleNames.includes(role.name)
      ),
    [roles, currentRoleNames]
  );

  // -----------------------------------------
  // Submit Request
  // -----------------------------------------
  const handleSubmit = async () => {
    const role = selectedRole[0];
    if (!role) return;

    await submitRequest(role);
    setSelectedRole([]);
  };

  // -----------------------------------------
  // Loading State
  // -----------------------------------------
  if (loading || rolesLoading) {
    return <Loader message="Loading..." fullScreen={false} />;
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <Card
        title="Role Requests"
        subtitle="Request additional permissions within your church"
        icon={<Shield size={18} />}
      />
      <TextDisplay as="p" size="sm" color="danger">
        The administrator cannot request a role
      </TextDisplay>

      {/* Request New Role */}
      <Card title="Request New Role">
        <div className={`${styles.formGroup} ${styles.scrollable}`}>
          {availableRoles.length > 0 ? (
            <RoleSelector
              roles={availableRoles}
              selectedRoles={selectedRole}
              onChange={setSelectedRole}
              multiple={false}
            />
          ) : (
            <p className={styles.textMuted}>
              You already have all available roles.
            </p>
          )}
        </div>

        {availableRoles.length > 0 && (
          <button
            onClick={handleSubmit}
            disabled={!selectedRole.length || submitting}
            className={styles.btnPrimary}
          >
            {submitting ? "Submitting..." : "Send Request"}
          </button>
        )}
      </Card>

      {/* My Requests */}
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
                  <BadgeList
                    items={request.role ? [request.role] : []}
                    getKey={(role) => role.name}
                    getLabel={(role) => role.label}
                  />
                  <small className={styles.textMuted}>
                    {new Date(request.requested_at).toLocaleDateString()}
                  </small>
                </div>

                <span
                  className={`${styles.statusLabel} ${
                    styles[
                      `status${
                        request.status.charAt(0).toUpperCase() +
                        request.status.slice(1)
                      }`
                    ]
                  }`}
                >
                  {request.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}


