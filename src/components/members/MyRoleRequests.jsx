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
    try {
      setLoading(true);
      const data = await RoleRequestsAPI.fetchMyRequests();
      setRequests(data ?? []);
    } catch (err) {
      console.error(err);
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
      loadRequests();
    } catch (err) {
      alert(err.message || "Failed to submit request");
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (profile?.id) loadRequests();
  }, [profile]);

  if (!profile) return <p>Loading profile…</p>;
  if (loading) return <p>Loading requests…</p>;

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-bold">Request a Role</h2>

      <div className="flex gap-2">
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="border px-2 py-1 rounded"
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
          className="px-3 py-1 bg-blue-600 text-white rounded disabled:opacity-50"
        >
          {submitting ? "Submitting…" : "Submit Request"}
        </button>
      </div>

      <h3 className="text-lg font-semibold mt-4">My Requests</h3>
      {requests.length === 0 && <p>No role requests yet.</p>}
      <ul className="list-disc pl-5">
        {requests.map((r) => (
          <li key={r.id}>
            {r.requested_role} – <strong>{r.status}</strong> ({new Date(r.created_at).toLocaleString()})
          </li>
        ))}
      </ul>
    </div>
  );
}
