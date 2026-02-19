import { useEffect, useState } from "react";
import { AdminMembershipAPI } from "../../utils/api";
import "../../styles/pages.css";

export default function MembershipRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState({});

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
      if (action === "approve") {
        await AdminMembershipAPI.approve(id);
      }

      if (action === "reject") {
        await AdminMembershipAPI.reject(id);
      }

      await loadRequests();
    } catch (err) {
      alert(err.message || "Action failed");
    } finally {
      setActionLoading((prev) => ({ ...prev, [id]: false }));
    }
  };

  if (loading)
    return (
      <div className="page-card">
        <p>Loading membership requests…</p>
      </div>
    );

  if (!requests.length)
    return (
      <div className="page-card">
        <p>No pending requests 🙏</p>
      </div>
    );

  return (
    <div className="page-container">
      <div className="page-card">
        <h2 className="card-title">Membership Requests</h2>
        <div className="table-responsive">
          <table className="members-table">
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
              {requests.map((r) => {
                const id = r.membership_request_id;

                return (
                  <tr key={id}>
                    <td>{r.full_name || "-"}</td>
                    <td>{r.email || "-"}</td>

                    <td>
                      <span className="status-label status-pending">
                        {r.membership_request_status}
                      </span>
                    </td>

                    <td>
                      {r.membership_requested_at
                        ? new Date(r.membership_requested_at).toLocaleString()
                        : "-"}
                    </td>

                    <td className="actions">
                      <button
                        className="btn btn-primary btn-role-request"
                        disabled={actionLoading[id]}
                        onClick={() => handleAction(id, "approve")}
                      >
                        {actionLoading[id] ? "…" : "Approve"}
                      </button>

                      <button
                        className="btn btn-secondary btn-role-request"
                        disabled={actionLoading[id]}
                        onClick={() => handleAction(id, "reject")}
                      >
                        {actionLoading[id] ? "…" : "Reject"}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
