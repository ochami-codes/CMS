import { useState, useEffect } from "react";
import { RoleRequestsAPI } from "../../utils/api";
import { useAuth } from "../../context/AuthContext";

const ROLES = [
  "Admin",
  "Pastor",
  "Treasurer",
  "Children_leader",
  "Youth_leader",
  "Communication_leader",
  "Member",
];

export default function MyRoleRequests() {
  const { profile } = useAuth();
  const [requests, setRequests] = useState([]);
  const [role, setRole] = useState("Member");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const loadRequests = async () => {
    if (!profile?.id) return;

    try {
      setLoading(true);
      const data = await RoleRequestsAPI.fetchMyRequests();

      // Ensure we always have an array
      const arr = Array.isArray(data) ? data : data.requests ?? [];
      setRequests(arr);
    } catch (err) {
      console.error("Failed to load role requests:", err);
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
      alert("Role request submitted!");
      setRole("Member"); // reset selection
      loadRequests();
    } catch (err) {
      alert(err.message || "Failed to submit request");
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, [profile]);

  if (!profile) {
    return <div className="p-4 card">Loading profile…</div>;
  }

  if (loading) {
    return <div className="p-4 card">Loading requests…</div>;
  }

  return (
    <div className="p-4 space-y-6">
      {/* Request Form */}
      <div className="card p-4 space-y-4">
        <h2 className="text-xl font-bold">Request a Role</h2>

        <div className="flex gap-2">
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="border rounded px-3 py-2 flex-1"
          >
            {ROLES.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
          <button
            onClick={submitRequest}
            disabled={submitting}
            className="btn-table btn-table-primary"
          >
            {submitting ? "Submitting…" : "Submit Request"}
          </button>
        </div>
      </div>

      {/* My Requests */}
      <div className="card p-4">
        <h3 className="text-lg font-semibold mb-3">My Requests</h3>

        {requests.length === 0 ? (
          <p className="text-gray-500">No role requests yet.</p>
        ) : (
          <ul className="list-disc pl-5 space-y-1">
            {requests.map((r) => (
              <li key={r.id} className="flex flex-col sm:flex-row sm:justify-between">
                <span>
                  {r.requested_role} – <strong>{r.status}</strong>
                </span>
                <span className="text-gray-500 text-sm">
                  {r.created_at
                    ? new Date(r.created_at).toLocaleString()
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
