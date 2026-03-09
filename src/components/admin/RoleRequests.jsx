import { useEffect, useState, useCallback } from "react";
import { AdminAPI } from "../../utils/api";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../components/ToastProvider";
import "../../styles/pages.css";

export default function RoleRequests() {
  const { user, loading: authLoading } = useAuth();
  const { showToast } = useToast();

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [processingId, setProcessingId] = useState(null);

  /* ------------------ Fetch Requests ------------------ */
  const fetchRequests = useCallback(async () => {
    if (!user?.church_id) return;

    setLoading(true);
    setError("");

    try {
      const data = await AdminAPI.fetchRoleRequests();
      setRequests(Array.isArray(data.requests) ? data.requests : []);
    } catch (err) {
      console.error("Failed to fetch role requests:", err);
      setRequests([]);
      setError(err.message || "Failed to load role requests");
      showToast(err.message || "Failed to load role requests", "error");
    } finally {
      setLoading(false);
    }
  }, [user?.church_id, showToast]);

  useEffect(() => {
    if (!authLoading && user?.church_id) {
      fetchRequests();
    }
  }, [authLoading, user?.church_id, fetchRequests]);

  /* ------------------ Actions ------------------ */
  const approve = async (id) => {
    setProcessingId(id);
    try {
      await AdminAPI.approveRoleRequest(id);
      setRequests((prev) => prev.filter((r) => r.id !== id));
      showToast("Request approved");
    } catch (err) {
      console.error(err);
      showToast("Failed to approve request", "error");
    } finally {
      setProcessingId(null);
    }
  };

  const reject = async (id) => {
    setProcessingId(id);
    try {
      await AdminAPI.rejectRoleRequest(id);
      setRequests((prev) => prev.filter((r) => r.id !== id));
      showToast("Request rejected");
    } catch (err) {
      console.error(err);
      showToast("Failed to reject request", "error");
    } finally {
      setProcessingId(null);
    }
  };

  /* ------------------ Render Guards ------------------ */
  if (authLoading)
    return <div className="dashboard-content">Checking admin permissions…</div>;

  if (!user)
    return <div className="dashboard-content">Loading admin profile…</div>;

  if (loading)
    return <div className="dashboard-content">Loading role requests…</div>;

  /* ------------------ Main Table ------------------ */
  return (
    <div className="card">
      <h2 className="card-title">Role Change Requests</h2>

      {error && <p style={{ color: "#dc2626" }}>{error}</p>}

      {requests.length === 0 ? (
        <p style={{ color: "#6b7280" }}>No pending requests.</p>
      ) : (
        <table className="members-table">
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
                <td>
                  <strong>{req.requested_role}</strong>
                </td>
                <td>{req.requester?.full_name || "System"}</td>
                <td className="dashboard-actions">
                  <button
                    className="btn btn-primary"
                    disabled={processingId === req.id}
                    onClick={() => approve(req.id)}
                  >
                    Approve
                  </button>

                  <button
                    className="btn btn-secondary"
                    disabled={processingId === req.id}
                    onClick={() => reject(req.id)}
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
