// src/components/admin/RoleRequests.jsx
import { useEffect, useState, useCallback } from "react";
import { AdminAPI } from "../../utils/api";
import { useAuth } from "../../context/AuthContext";

export default function RoleRequests() {
  const { profile, loading: authLoading } = useAuth();

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [processingId, setProcessingId] = useState(null);

  /* ------------------ Fetch Requests ------------------ */
  const fetchRequests = useCallback(async () => {
    if (!profile?.church_id) return;

    setLoading(true);
    setError("");

    try {
      const data = await AdminAPI.fetchRoleRequests();

      if (!Array.isArray(data)) {
        setRequests([]);
        return;
      }

      setRequests(data);
    } catch (err) {
      console.error("Failed to fetch role requests:", err);
      setRequests([]);
      setError(err.message || "Failed to load role requests");
    } finally {
      setLoading(false);
    }
  }, [profile]);

  /* ------------------ Effects ------------------ */
  useEffect(() => {
    if (authLoading || !profile?.church_id) return;

    fetchRequests();
    const interval = setInterval(fetchRequests, 10000);
    return () => clearInterval(interval);
  }, [authLoading, profile, fetchRequests]);

  /* ------------------ Actions ------------------ */
  const approve = async (id) => {
    setProcessingId(id);
    try {
      await AdminAPI.approveRoleRequest(id);
      setRequests((prev) => prev.filter((r) => r.id !== id));
    } catch {
      alert("Failed to approve request");
    } finally {
      setProcessingId(null);
    }
  };

  const reject = async (id) => {
    setProcessingId(id);
    try {
      await AdminAPI.rejectRoleRequest(id);
      setRequests((prev) => prev.filter((r) => r.id !== id));
    } catch {
      alert("Failed to reject request");
    } finally {
      setProcessingId(null);
    }
  };

  /* ------------------ Render Guards ------------------ */
  if (authLoading) {
    return <div className="p-4">Checking admin permissions…</div>;
  }

  if (!profile) {
    return <div className="p-4">Loading admin profile…</div>;
  }

  if (loading) {
    return <div className="p-4">Loading role requests…</div>;
  }

  /* ------------------ UI ------------------ */
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Role Change Requests</h2>

      {error && <p className="text-red-600 mb-3">{error}</p>}

      {requests.length === 0 ? (
        <p className="text-gray-600">No pending requests.</p>
      ) : (
        <table className="w-full border">
          <thead>
            <tr className="border-b bg-gray-50">
              <th className="p-2 text-left">Member</th>
              <th className="p-2 text-left">Current Role</th>
              <th className="p-2 text-left">Requested Role</th>
              <th className="p-2 text-left">Requested By</th>
              <th className="p-2 text-left">Action</th>
            </tr>
          </thead>

          <tbody>
            {requests.map((req) => (
              <tr key={req.id} className="border-b">
                <td className="p-2">
                  {req.target_user?.full_name || "(Unknown member)"}
                </td>
                <td className="p-2">
                  {req.target_user?.role || "-"}
                </td>
                <td className="p-2 font-semibold">
                  {req.requested_role}
                </td>
                <td className="p-2">
                  {req.requester?.full_name || "(System)"}
                </td>
                <td className="p-2 flex gap-2">
                  <button
                    disabled={processingId === req.id}
                    onClick={() => approve(req.id)}
                    className="px-3 py-1 bg-green-600 text-white rounded disabled:opacity-50"
                  >
                    Approve
                  </button>
                  <button
                    disabled={processingId === req.id}
                    onClick={() => reject(req.id)}
                    className="px-3 py-1 bg-red-600 text-white rounded disabled:opacity-50"
                  >
                    Reject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
