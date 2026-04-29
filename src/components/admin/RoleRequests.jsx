import { useEffect, useState, useCallback } from "react";
import { AdminAPI } from "../../utils/api";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../components/ToastProvider";
import "../../styles/pages.css";
import "../../styles/tables.css";

export default function RoleRequests() {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [requests, setRequests] = useState([]);
  const [error, setError] = useState("");
  const [processingId, setProcessingId] = useState(null);

  /* ---------------- Fetch Requests ---------------- */
  const fetchRequests = useCallback(async () => {
    if (!user?.church_id) return;

    setError("");

    try {
      const { requests } = await AdminAPI.fetchRoleRequests();
      setRequests(Array.isArray(requests) ? requests : []);
    } catch (err) {
      console.error("Failed to fetch role requests:", err);

      const message = err.message || "Failed to load role requests";
      setRequests([]);
      setError(message);
      showToast(message, "error");
    }
  }, [user?.church_id, showToast]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  /* ---------------- Handle Action ---------------- */
  const handleRoleRequest = async (request, action) => {
    setProcessingId(request.id);

    try {
      await AdminAPI.reviewRoleRequest(request.id, action);

      setRequests((prev) => prev.filter((r) => r.id !== request.id));

      const name = request.target_user?.full_name || "member";
      const message =
        action === "approved"
          ? `Approved role request for ${name}`
          : `Rejected role request for ${name}`;

      showToast(message);
    } catch (err) {
      const message =
        action === "approved"
          ? "Failed to approve request"
          : "Failed to reject request";

      showToast(message, "error");
    } finally {
      setProcessingId(null);
    }
  };

  /* ---------------- UI States ---------------- */
  if (!user) {
    return <div className="dashboard-content">Loading admin profile…</div>;
  }

  return (
    <div className="card">
      <h2 className="card-title">Role Change Requests</h2>

      {error && <p className="text-error">{error}</p>}

      {requests.length === 0 ? (
        <p className="text-muted">No pending requests.</p>
      ) : (
        <>
          {/* -------- Desktop Table -------- */}
          <div className="desktop-table">
            <div className="table-scroll">
              <table className="members-table role-requests-table">
                <thead>
                  <tr>
                    <th>Member</th>
                    <th>Current Role</th>
                    <th>Requested Role</th>
                    <th>Requested By</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {requests.map((req) => (
                    <tr key={req.id}>
                      <td>{req.target_user?.full_name || "—"}</td>
                      <td>{req.requester?.role || "—"}</td>
                      <td>
                        <strong>{req.requested_role || "—"}</strong>
                      </td>
                      <td>{req.requester?.full_name || "System"}</td>
                      <td>
                        <div className="table-actions">
                          <button
                            className="btn btn-primary"
                            disabled={processingId === req.id}
                            onClick={() =>
                              handleRoleRequest(req, "approved")
                            }
                          >
                            Approve
                          </button>

                          <button
                            className="btn btn-secondary"
                            disabled={processingId === req.id}
                            onClick={() =>
                              handleRoleRequest(req, "rejected")
                            }
                          >
                            Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* -------- Mobile Cards -------- */}
          <div className="mobile-cards">
            {requests.map((req) => (
              <div key={req.id} className="member-card">
                <h3>{req.target_user?.full_name || "—"}</h3>

                <p>
                  <strong>Current:</strong>{" "}
                  {req.requester?.role || "—"}
                </p>

                <p>
                  <strong>Requested:</strong>{" "}
                  {req.requested_role || "—"}
                </p>

                <p>
                  <strong>By:</strong>{" "}
                  {req.requester?.full_name || "System"}
                </p>

                <div className="card-actions">
                  <button
                    className="btn btn-primary"
                    disabled={processingId === req.id}
                    onClick={() =>
                      handleRoleRequest(req, "approved")
                    }
                  >
                    Approve
                  </button>

                  <button
                    className="btn btn-secondary"
                    disabled={processingId === req.id}
                    onClick={() =>
                      handleRoleRequest(req, "rejected")
                    }
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
