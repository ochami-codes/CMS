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

  /* ------------------ Fetch Requests ------------------ */
  const fetchRequests = useCallback(async () => {
    if (!user?.church_id) return;

    setError("");

    try {
      const data = await AdminAPI.fetchRoleRequests();
      setRequests(Array.isArray(data.requests) ? data.requests : []);
    } catch (err) {
      console.error("Failed to fetch role requests:", err);
      setRequests([]);
      setError(err.message || "Failed to load role requests");
      showToast(err.message || "Failed to load role requests", "error");
    }
  }, [user?.church_id, showToast]);

  useEffect(() => {
    if (user?.church_id) {
      fetchRequests();
    }
  }, [user?.church_id, fetchRequests]);

  /* ------------------ Actions ------------------ */
  const handleRoleRequest = async (request, action) => {
    setProcessingId(request.id);

    try {
      await AdminAPI.reviewRoleRequest(request.id, action);

      setRequests((prev) =>
        prev.filter((r) => r.id !== request.id)
      );

      showToast(
        action === "approved"
          ? `Approved role request for ${request.target_user?.full_name}`
          : `Rejected role request for ${request.target_user?.full_name}`
      );
    } catch {
      showToast(
        action === "approved"
          ? "Failed to approve request"
          : "Failed to reject request",
        "error"
      );
    } finally {
      setProcessingId(null);
    }
  };

  if (!user) {
    return <div className="dashboard-content">Loading admin profile…</div>;
  }

  return (
    <div className="card">
      <h2 className="card-title">Role Change Requests</h2>

      {error && <p style={{ color: "#dc2626" }}>{error}</p>}

      {requests.length === 0 ? (
        <p style={{ color: "#6b7280" }}>No pending requests.</p>
      ) : (
        <>
          {/* ================= DESKTOP TABLE ================= */}
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
                      <td>{req.target_user?.role || "—"}</td>
                      <td><strong>{req.requested_role}</strong></td>
                      <td>{req.requester?.full_name || "System"}</td>
                      <td>
                        <button
                          className="btn btn-primary"
                          disabled={processingId === req.id}
                          onClick={() => handleRoleRequest(req, "approved")}
                        >
                          Approve
                        </button>

                        <button
                          className="btn btn-secondary"
                          disabled={processingId === req.id}
                          onClick={() => handleRoleRequest(req, "rejected")}
                        >
                          Reject
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* ================= MOBILE CARDS ================= */}
          <div className="mobile-cards">
            {requests.map((req) => (
              <div key={req.id} className="member-card">
                <h3>{req.target_user?.full_name || "—"}</h3>

                <p><strong>Current:</strong> {req.target_user?.role || "—"}</p>
                <p><strong>Requested:</strong> {req.requested_role}</p>
                <p><strong>By:</strong> {req.requester?.full_name || "System"}</p>

                <div className="card-actions">
                  <button
                    className="btn btn-primary"
                    disabled={processingId === req.id}
                    onClick={() => handleRoleRequest(req, "approved")}
                  >
                    Approve
                  </button>

                  <button
                    className="btn btn-secondary"
                    disabled={processingId === req.id}
                    onClick={() => handleRoleRequest(req, "rejected")}
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
