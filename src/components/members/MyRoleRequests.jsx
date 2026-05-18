// src/components/members/MyRoleRequests.jsx
import { useState, useEffect } from "react";
import { Shield, Clock, CheckCircle, XCircle } from "lucide-react";
import { RoleRequestsAPI } from "../../utils/api";
import { useAuth } from "../../context/AuthContext";
import "../../styles/pages.css";

export default function MyRoleRequests() {
  const { user, rolesData, getRoleLabel } = useAuth();

  const [requests, setRequests] = useState([]);
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const loadRequests = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);

      const data =
        await RoleRequestsAPI.fetchMyRequests();

      setRequests(
        Array.isArray(data)
          ? data
          : data.requests ?? []
      );
    } catch {
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  const submitRequest = async () => {
    if (!role) return;

    try {
      setSubmitting(true);

      await RoleRequestsAPI.submit(role);

      alert("Request submitted");

      setRole("");
      loadRequests();
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, [user]);

  const statusClass = (status) => {
    if (status === "approved")
      return "status-approved";

    if (status === "rejected")
      return "status-rejected";

    return "status-pending";
  };

  if (loading)
    return (
      <div className="page-card">
        Loading requests...
      </div>
    );

  return (
    <div className="page-container role-page">

      {/* Header */}
      <div className="role-header">
        <h1>Role Requests</h1>
        <p>
          Request additional permissions
          within your church.
        </p>
      </div>

      {/* Request Form */}
      <div className="page-card role-request-card">

        <div className="card-title">
          <Shield size={20}/>
          Request New Role
        </div>

        <div className="role-form">

          <select
            value={role}
            onChange={(e) =>
              setRole(e.target.value)
            }
            className="role-select"
          >
            <option value="">
              Select role
            </option>

            {rolesData.roles
              .filter(
                r => r.name !== "admin"
              )
              .map(r => (
                <option
                  key={r.name}
                  value={r.name}
                >
                  {r.label}
                </option>
              ))}
          </select>

          <button
            onClick={submitRequest}
            disabled={
              !role || submitting
            }
            className="btn btn-primary"
          >
            {submitting
              ? "Submitting..."
              : "Send Request"}
          </button>

        </div>

      </div>

      {/* Requests */}
      <div className="page-card">

        <div className="card-title">
          My Requests
        </div>

        {!requests.length ? (

          <div className="empty-state">
            No role requests yet
          </div>

        ) : (

          <div className="request-list">

            {requests.map(r => (

              <div
                key={r.id}
                className="request-item"
              >

                <div>

                  <div className="request-role">
                    {getRoleLabel(
                      r.requested_role
                    )}
                  </div>

                  <small className="request-date">
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

      </div>

    </div>
  );
}
