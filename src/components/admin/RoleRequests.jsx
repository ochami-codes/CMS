import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";

export default function RoleRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);

  const fetchRequests = async () => {
    const { data, error } = await supabase
      .from("role_requests")
      .select(`
        id,
        requested_role,
        status,
        created_at,
        requester:profiles!role_requests_requester_fkey(full_name),
        target_user:profiles!role_requests_target_user_fkey(id, full_name, role)
      `)
      .eq("status", "pending")
      .order("created_at", { ascending: false });

    if (!error) setRequests(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchRequests();

    // Auto-refresh every 10 seconds
    const interval = setInterval(() => {
      fetchRequests();
    }, 10000);

    return () => clearInterval(interval); // clean up on unmount
  }, []);

  const approveRequest = async (request) => {
    setProcessingId(request.id);

    const { error: roleError } = await supabase
      .from("profiles")
      .update({ role: request.requested_role })
      .eq("id", request.target_user.id);

    if (roleError) {
      alert("You are not allowed to approve this request.");
      setProcessingId(null);
      return;
    }

    await supabase
      .from("role_requests")
      .update({ status: "approved" })
      .eq("id", request.id);

    setRequests((prev) => prev.filter((r) => r.id !== request.id));
    setProcessingId(null);
  };

  const rejectRequest = async (id) => {
    setProcessingId(id);
    await supabase
      .from("role_requests")
      .update({ status: "rejected" })
      .eq("id", id);
    setRequests((prev) => prev.filter((r) => r.id !== id));
    setProcessingId(null);
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
                <td className="p-2">{req.requester?.full_name}</td>
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