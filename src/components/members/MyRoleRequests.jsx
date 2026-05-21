// src/components/members/MyRoleRequests.jsx
import { useState, useEffect, useMemo } from "react";
import { Shield } from "lucide-react";

import { RoleRequestsAPI } from "../../utils/api";
import { useAuth } from "../../context/AuthContext";

import Card from "../Card";

export default function MyRoleRequests() {
  const { user, rolesData, getRoleLabel } = useAuth();

  const [requests, setRequests] = useState([]);
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

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
    if (!role) return;

    try {
      setSubmitting(true);

      await RoleRequestsAPI.submit(role);

      setRole("");
      await loadRequests();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  /* ---------------- HELPERS ---------------- */
  const availableRoles = useMemo(() => {
    return (rolesData?.roles ?? []).filter(
      (r) => r.name !== "admin"
    );
  }, [rolesData]);

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
  if (loading) {
    return (
      <Card title="Role Requests">
        Loading requests...
      </Card>
    );
  }

  /* ---------------- UI ---------------- */
  return (
    <div className="space-y-4">

      {/* HEADER */}
      <Card
        title="Role Requests"
        subtitle="Request additional permissions within your church"
        icon={<Shield size={18} />}
      />

      {/* REQUEST FORM */}
      <Card title="Request New Role">

        <div className="form-group">

          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="input"
          >
            <option value="">Select role</option>

            {availableRoles.map((r) => (
              <option key={r.name} value={r.name}>
                {r.label}
              </option>
            ))}

          </select>

        </div>

        <button
          onClick={submitRequest}
          disabled={!role || submitting}
          className="btn btn-primary"
        >
          {submitting ? "Submitting..." : "Send Request"}
        </button>

      </Card>

      {/* REQUEST LIST */}
      <Card title="My Requests">

        {!requests.length ? (
          <p className="text-muted">
            No role requests yet
          </p>
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
                    {new Date(
                      r.role_requested_at
                    ).toLocaleDateString()}
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
