import { useEffect, useState } from "react";
import  { API_BASE_URL } from "../../config/api";
export default function RoleRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);

  const API = API_BASE_URL;

  const fetchRequests = async () => {
    try {
      const res = await fetch(`${API}/admin/role-requests`, {
        credentials: "include",
      });

      if (!res.ok) return;

      const data = await res.json();
      setRequests(data);
    } catch (err) {
      console.error("Failed to fetch role requests", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
    const interval = setInterval(fetchRequests, 10000);
    return () => clearInterval(interval);
  }, []);

  const approveRequest = async (req) => {
    setProcessingId(req.id);

    try {
      const res = await fetch(
        `${API}/admin/role-requests/${req.id}/approve`,
        {
          method: "POST",
          credentials: "include",
        }
      );

      if (res.ok) {
        setRequests((prev) => prev.filter((r) => r.id !== req.id));
      }
    } catch (err) {
      alert("Failed to approve request.");
    } finally {
      setProcessingId(null);
    }
  };

  const rejectRequest = async (id) => {
    setProcessingId(id);

    try {
      const res = await fetch(
        `${API}/admin/role-requests/${id}/reject`,
        {
          method: "POST",
          credentials: "include",
        }
      );

      if (res.ok) {
        setRequests((prev) => prev.filter((r) => r.id !== id));
      }
    } catch (err) {
      alert("Failed to reject request.");
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) return <div className="p-4">Loading role requests...</div>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Role Change Requests</h2>

      {requests.length === 0 ? (
        <p>No pending requests.</p>
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
                <td className="p-2">{req.target_user.full_name}</td>
                <td className="p-2">{req.target_user.role}</td>
                <td className="p-2 font-semibold">{req.requested_role}</td>
                <td className="p-2">{req.requester.full_name}</td>
                <td className="p-2 flex gap-2">
                  <button
                    onClick={() => approveRequest(req)}
                    disabled={processingId === req.id}
                    className="px-3 py-1 bg-green-600 text-white rounded disabled:opacity-50"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => rejectRequest(req.id)}
                    disabled={processingId === req.id}
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