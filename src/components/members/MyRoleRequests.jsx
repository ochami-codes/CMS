// src/components/members/MyRoleRequests.jsx
import { useState, useEffect, useMemo } from "react";
import { Shield } from "lucide-react";

import { RoleRequestsAPI } from "../../utils/api";
import { useAuth } from "../../context/AuthContext";
import { useRoles } from "../../hooks/admin/useRoles"; 

import Card from "../Card";
import RoleSelector from "../RoleSelector";

export default function MyRoleRequests() {
  const { user, getRoleLabel } = useAuth();
  const { roles, loading: rolesLoading } = useRoles(); 

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [selectedRole, setSelectedRole] = useState([]);

  /* ---------------- LOAD ---------------- */
  const loadRequests = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);

      const data = await RoleRequestsAPI.fetchMyRequests();

      setRequests(Array.isArray(data) ? data : data?.requests ?? []);
    } catch (err) {
      console.error(err);
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, [user]);

  /* ---------------- SUBMIT ---------------- */
  const submitRequest = async () => {
    const roleToSubmit = selectedRole[0];

    if (!roleToSubmit) return;

    try {
      setSubmitting(true);

      await RoleRequestsAPI.submit(roleToSubmit);

      setSelectedRole([]);
      await loadRequests();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  /* ---------------- HELPERS ---------------- */
  const availableRoles = useMemo(() => {
    return roles.filter((r) => r.name !== "admin");
  }, [roles]);

  const statusClass = (status) => {
    switch (status) {
      case "approved":
        return "status-success";
      case "rejected":
        return "status-danger";
      default:
        return "status-warning";
    }
  };

  /* ---------------- STATES ---------------- */
  if (loading || rolesLoading) {
    return (
      <Card title="Role Requests">
        Loading requests...
      </Card>
    );
  }

  /* ---------------- UI ---------------- */
  return (
    <div className="space-y-4">
      <Card
        title="Role Requests"
        subtitle="Request additional permissions within your church"
        icon={<Shield size={18} />}
      />

      <Card title="Request New Role">
        <div className="form-group">
          <RoleSelector
            roles={availableRoles}
            selectedRoles={selectedRole}
            onChange={setSelectedRole}
            getRoleLabel={getRoleLabel}
            multiple={false}
          />
        </div>

        <button
          onClick={submitRequest}
          disabled={!selectedRole.length || submitting}
          className="btn btn-primary"
        >
          {submitting ? "Submitting..." : "Send Request"}
        </button>
      </Card>

      <Card title="My Requests">
        {!requests.length ? (
          <p className="text-muted">No role requests yet</p>
        ) : (
          <div className="list">
            {requests.map((r) => (
              <div
                key={r.id}
                className="list-item flex justify-between items-center"
              >
                <div>
                  <div className="font-medium">
                    {getRoleLabel(r.requested_role)}
                  </div>

                  <small className="text-muted">
                    {new Date(r.role_requested_at).toLocaleDateString()}
                  </small>
                </div>

                <span
                  className={`status-label ${statusClass(
                    r.role_request_status
                  )}`}
                >
                  {r.role_request_status}
                </span>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}