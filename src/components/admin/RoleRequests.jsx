// src/components/admin/RoleRequests.jsx
import { useEffect, useState, useCallback } from "react";
import { AdminAPI } from "../../utils/api";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast"; // optional toast notifications

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

      // Ensure we get an array
      setRequests(Array.isArray(data.requests) ? data.requests : []);
    } catch (err) {
      console.error("Failed to fetch role requests:", err);
      setRequests([]);
      setError(err.message || "Failed to load role requests");
    } finally {
      setLoading(false);
    }
  }, [profile]);

  /* ------------------ Polling ------------------ */
  useEffect(() => {
    if (authLoading || !profile?.church_id) return;

    let isMounted = true;

    const fetchLoop = async () => {
      while (isMounted) {
        await fetchRequests();
        await new Promise((r) => setTimeout(r, 10000));
      }
    };

    fetchLoop();

    return () => {
      isMounted = false;
    };
  }, [authLoading, profile, fetchRequests]);

  /* ------------------ Actions ------------------ */
  const approve = async (id) => {
    setProcessingId(id);
    try {
      await AdminAPI.approveRoleRequest(id);
      setRequests((prev) => prev.filter((r) => r.id !== id));
      toast.success("Request approved");
    } catch (err) {
      console.error(err);
      toast.error("Failed to approve request");
    } finally {
      setProcessingId(null);
    }
  };

  const reject = async (id) => {
    setProcessingId(id);
    try {
      await AdminAPI.rejectRoleRequest(id);
      setRequests((prev) => prev.filter((r) => r.id !== id));
      toast.success("Request rejected");
    } catch (err) {
      console.error(err);
      toast.error("Failed to reject request");
    } finally {
      setProcessingId(null);
    }
  };

  /* ------------------ Render Guards ------------------ */
  if (authLoading) return <div className="p-4">Checking admin permissions…</div>;
  if (!profile) return <div className="p-4">Loading admin profile…</div>;
  if (loading) return <div className="p-4">Loading role requests…</div>;

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
              <tr key={req.id} className="border-b hover:bg-gray-100">
                <td className="p-2">{req.target_user?.full_name || "(Unknown member)"}</td>
                <td className="p-2">{req.target_user?.role || "-"}</td>
                <td className="p-2 font-semibold">{req.requested_role}</td>
                <td className="p-2">{req.requester?.full_name || "(System)"}</td>
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
