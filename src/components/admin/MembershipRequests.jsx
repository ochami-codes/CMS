import { useEffect, useState } from "react";
import { AdminMembershipAPI,AdminAPI } from "../../utils/api";
import "../../styles/pages.css";

export default function MembershipRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState({}); // track per-row button

  const loadRequests = async () => {
    try {
      setLoading(true);
      const res = await AdminMembershipAPI.fetchAll();
      setRequests(res.requests || []);
    } catch (err) {
      console.error("Failed to load membership requests:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const handleAction = async (id, action) => {
    setActionLoading((prev) => ({ ...prev, [id]: true }));

    try {
      if (action === "approve") await AdminMembershipAPI.approve(id);
      if (action === "reject") await AdminMembershipAPI.reject(id);
      if (action === "invite") await AdminAPI.sendInvite(id);

      // Reload the list after action
      loadRequests();
    } catch (err) {
      alert(err.message || "Action failed");
    } finally {
      setActionLoading((prev) => ({ ...prev, [id]: false }));
    }
  };

  if (loading) return <div className="card">Loading membership requests…</div>;
  if (!requests.length) return <div className="card">No pending requests 🙏</div>;

  return (
    <div className="card">
      <h3>Membership Requests</h3>
      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Status</th>
            <th>Requested At</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((r) => (
            <tr key={r.id}>
              <td>{r.requester?.full_name}</td>
              <td>{r.requester?.email}</td>
              <td>{r.status}</td>
              <td>{r.requested_at ? new Date(r.requested_at).toLocaleString() : "-"}</td>
              <td className="actions">
                {r.status === "pending" && (
                  <>
                    <button
                      className="btn btn-primary"
                      disabled={actionLoading[r.id]}
                      onClick={() => handleAction(r.id, "approve")}
                    >
                      {actionLoading[r.id] ? "…" : "Approve"}
                    </button>
                    <button
                      className="btn btn-secondary"
                      disabled={actionLoading[r.id]}
                      onClick={() => handleAction(r.id, "reject")}
                    >
                      {actionLoading[r.id] ? "…" : "Reject"}
                    </button>
                  </>
                )}
                {r.status === "new" && (
                  <button
                    className="btn btn-primary"
                    disabled={actionLoading[r.id]}
                    onClick={() => handleAction(r.id, "invite")}
                  >
                    {actionLoading[r.id] ? "…" : "Invite"}
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
