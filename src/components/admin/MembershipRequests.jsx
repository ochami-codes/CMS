import { useEffect, useState } from "react";
import { AdminMembershipAPI } from "../../utils/api";
import { useToast } from "../../components/ToastProvider";
import "../../styles/pages.css";
import "../../styles/tables.css";

export default function MembershipRequests() {
  const { showToast } = useToast();

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
      showToast("Failed to load membership requests", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const handleAction = async (id, action) => {
    const map = {
      approve: "approved",
      reject: "rejected",
    };

    const key = `${id}-${action}`;
    setActionLoading((p) => ({ ...p, [key]: true }));

    try {
      await AdminMembershipAPI.review(id, map[action]);
      showToast(
        map[action] === "approved"
          ? "Membership approved"
          : "Membership rejected"
      );
      await loadRequests();
    } catch (err) {
      showToast(err.message || "Action failed", "error");
    } finally {
      setActionLoading((p) => ({ ...p, [key]: false }));
    }
  };

  const renderStatusBadge = (status) => {
    switch (status) {
      case "requested":
        return <span className="status-label status-warning">Pending</span>;
      case "approved":
        return <span className="status-label status-success">Approved</span>;
      case "rejected":
        return <span className="status-label status-danger">Rejected</span>;
      default:
        return <span className="status-label">{status}</span>;
    }
  };

  return (
    <div className="page-container">
      <div className="page-card">
        <h2 className="card-title">Membership Requests</h2>

        {/* ================= INLINE LOADING ================= */}
        {loading ? (
          <div className="table-loading-state">
            <div className="spinner" />
            <p>Loading membership requests…</p>
          </div>
        ) : requests.length === 0 ? (
          <p>No pending requests 🙏</p>
        ) : (
          <>
            {/* ================= DESKTOP TABLE ================= */}
            <div className="desktop-table table-scroll">
              <table className="role-requests-table">
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
                            ? new Date(r.membership_requested_at).toLocaleString()
                            : "-"}
                        </td>
                        <td>
                          {isPending ? (
                            <>
                              <button
                                className="btn btn-primary action-btn"
                                disabled={actionLoading[`${id}-approve`]}
                                onClick={() => handleAction(id, "approve")}
                              >
                                {actionLoading[`${id}-approve`]
                                  ? "Approving…"
                                  : "Approve"}
                              </button>

                              <button
                                className="btn btn-secondary action-btn"
                                disabled={actionLoading[`${id}-reject`]}
                                onClick={() => handleAction(id, "reject")}
                              >
                                {actionLoading[`${id}-reject`]
                                  ? "Rejecting…"
                                  : "Reject"}
                              </button>
                            </>
                          ) : (
                            <span className="text-muted">No action</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* ================= MOBILE CARDS ================= */}
            <div className="mobile-cards">
              {requests.map((r) => {
                const id = r.membership_request_id;
                const isPending = r.membership_status === "requested";

                return (
                  <div key={id} className="member-card">
                    <h3>{r.full_name || "Unknown User"}</h3>

                    <p><strong>Email:</strong> {r.email || "-"}</p>

                    <p>
                      <strong>Status:</strong>{" "}
                      {renderStatusBadge(r.membership_status)}
                    </p>

                    <p>
                      <strong>Requested:</strong>{" "}
                      {r.membership_requested_at
                        ? new Date(r.membership_requested_at).toLocaleString()
                        : "-"}
                    </p>

                    <div className="card-actions">
                      {isPending ? (
                        <>
                          <button
                            className="btn btn-primary action-btn"
                            disabled={actionLoading[`${id}-approve`]}
                            onClick={() => handleAction(id, "approve")}
                          >
                            {actionLoading[`${id}-approve`]
                              ? "Approving…"
                              : "Approve"}
                          </button>

                          <button
                            className="btn btn-secondary action-btn"
                            disabled={actionLoading[`${id}-reject`]}
                            onClick={() => handleAction(id, "reject")}
                          >
                            {actionLoading[`${id}-reject`]
                              ? "Rejecting…"
                              : "Reject"}
                          </button>
                        </>
                      ) : (
                        <span className="text-muted">No action available</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
