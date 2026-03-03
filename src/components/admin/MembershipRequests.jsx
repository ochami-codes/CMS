import { useEffect, useState } from "react";
import { AdminMembershipAPI } from "../../utils/api";
import Loader from "../../components/Loader";
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
      } else if (action === "reject") {
        await AdminMembershipAPI.reject(id);
      }

      await loadRequests();
    } catch (err) {
      alert(err.message || "Action failed");
    } finally {
      setActionLoading((prev) => ({ ...prev, [id]: false }));
    }
  };

  if (loading) return <Loader message="Loading membership requests…" />;

  if (!requests.length) {
    return (
      <div className="page-card">
        <h2 className="card-title">Membership Requests</h2>
        <p>No pending requests 🙏</p>
      </div>
    );
  }

  const renderStatusBadge = (status) => {
    switch (status) {
      case "requested":
        return (
          <span className="status-label status-warning">
            Pending
          </span>
        );
      case "approved":
        return (
          <span className="status-label status-success">
            Approved
          </span>
        );
      case "rejected":
        return (
          <span className="status-label status-danger">
            Rejected
          </span>
        );
      default:
        return (
          <span className="status-label">
            {membership_status}
          </span>
        );
    }
  };

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
                const isPending = r.membership_status === "requested";

                return (
                  <tr key={id}>
                    <td>{r.full_name || "-"}</td>
                    <td>{r.email || "-"}</td>

                    <td>{renderStatusBadge(r.membership_status)}</td>

                    <td>
                      {r.membership_requested_at
                        ? new Date(
                            r.membership_requested_at
                          ).toLocaleString()
                        : "-"}
                    </td>

                    <td className="actions">
                      {isPending ? (
                        <>
                          <button
                            className="btn btn-primary btn-role-request"
                            disabled={actionLoading[id]}
                            onClick={() =>
                              handleAction(id, "approve")
                            }
                          >
                            {actionLoading[id]
                              ? "Approving…"
                              : "Approve"}
                          </button>

                          <button
                            className="btn btn-secondary btn-role-request"
                            disabled={actionLoading[id]}
                            onClick={() =>
                              handleAction(id, "reject")
                            }
                          >
                            {actionLoading[id]
                              ? "Rejecting…"
                              : "Reject"}
                          </button>
                        </>
                      ) : (
                        <span className="text-muted">
                          No action
                        </span>
                      )}
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
