// src/components/members/MyRoleRequests.jsx
import { useState, useEffect } from "react";
import { RoleRequestsAPI } from "../../utils/api";
import { useAuth } from "../../context/AuthContext";
import "../../styles/pages.css";

export default function MyRoleRequests() {
  const { user, rolesData, getRoleLabel } = useAuth();
  const [requests, setRequests] = useState([]);
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  /* ------------------ Load my role requests ------------------ */
  const loadRequests = async () => {
    if (!user?.id) return;
    try {
      setLoading(true);
      const data = await RoleRequestsAPI.fetchMyRequests();
      setRequests(Array.isArray(data) ? data : data.requests ?? []);
    } catch (err) {
      console.error(err);
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  /* ------------------ Submit new role request ------------------ */
  const submitRequest = async () => {
    if (!role) return;

    try {
      setSubmitting(true);
      await RoleRequestsAPI.submit(role);
      alert("Role request submitted!");
      setRole(""); // reset selection
      loadRequests();
    } catch (err) {
      alert(err.message || "Failed to submit request");
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, [user]);

  if (!user) {
    return (
      <div className="page-container">
        <div className="page-card">Loading profile…</div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="page-container">
        <div className="page-card">Loading requests…</div>
      </div>
    );
  }

  return (
    <div className="page-container space-y-6">
      {/* Request Form */}
      <div className="page-card">
        <h2 className="card-title">Request a Role</h2>

        <div className="form-group flex-row">
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="input flex-1"
          >
            <option value="">Select a role…</option>
            {rolesData.roles
              .filter(r => r.name !== "admin") // exclude admin
              .map(r => (
                <option key={r.name} value={r.name}>
                  {r.label}
                </option>
              ))}
          </select>

          <button
            onClick={submitRequest}
            disabled={submitting || !role}
            className="btn btn-primary ml-2"
          >
            {submitting ? "Submitting…" : "Submit Request"}
          </button>
        </div>
      </div>

      {/* My Requests */}
      <div className="page-card">
        <h3 className="card-title">My Requests</h3>
        {requests.length === 0 ? (
          <p className="card-subtitle">No role requests yet.</p>
        ) : (
          <ul className="list-disc pl-5">
            {requests.map((r) => (
              <li
                key={r.id}
                className="flex flex-col sm:flex-row sm:justify-between py-1"
              >
                <span>
                  {getRoleLabel(r.requested_role)} – <strong>{r.role_request_status}</strong>
                </span>
                <span className="text-gray-500 text-sm">
                  {r.role_requested_at
                    ? new Date(r.role_requested_at).toLocaleString()
                    : "-"}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
