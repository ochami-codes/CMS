import { useEffect, useState, useCallback } from "react";
import { AdminAPI } from "../../utils/api";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../components/ToastProvider";
import "../../styles/pages.css";
import "../../styles/tables.css";

export default function RoleRequests() {
  const {
    user,
    authReady,
    activeChurchId,
    activeMembership,
    hasRole,
  } = useAuth();

  const { showToast } = useToast();

  const [requests, setRequests] = useState([]);
  const [error, setError] = useState("");
  const [processingId, setProcessingId] = useState(null);
  const [loading, setLoading] = useState(true);

  /* ---------------- Permissions ---------------- */
  const canManageRoles =
    hasRole?.("admin") ||
    hasRole?.("elder") ||
    hasRole?.("pastor");

  /* ---------------- Fetch Requests ---------------- */
  const fetchRequests = useCallback(async () => {
    if (!authReady || !activeChurchId || !canManageRoles) {
      setRequests([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const { requests } = await AdminAPI.fetchRoleRequests();

      setRequests(Array.isArray(requests) ? requests : []);
    } catch (err) {
      console.error("Failed to fetch role requests:", err);

      const message =
        err?.message || "Failed to load role requests";

      setRequests([]);
      setError(message);

      showToast(message, "error");
    } finally {
      setLoading(false);
    }
  }, [authReady, activeChurchId, canManageRoles, showToast]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  /* ---------------- Handle Action ---------------- */
  const handleRoleRequest = async (request, action) => {
    setProcessingId(request.id);

    try {
      await AdminAPI.reviewRoleRequest(request.id, action);

      setRequests((prev) =>
        prev.filter((r) => r.id !== request.id)
      );

      const memberName =
        request.target_user?.full_name || "member";

      const message =
        action === "approved"
          ? `Approved role request for ${memberName}`
          : `Rejected role request for ${memberName}`;

      showToast(message, "success");
    } catch (err) {
      console.error("Role request action failed:", err);

      const message =
        action === "approved"
          ? "Failed to approve request"
          : "Failed to reject request";

      showToast(message, "error");
    } finally {
      setProcessingId(null);
    }
  };

  /* ---------------- Loading ---------------- */
  if (!authReady || loading) {
    return (
      <div className="dashboard-content">
        Loading role requests…
      </div>
    );
  }

  /* ---------------- Access Guard ---------------- */
  if (!user || !activeChurchId) {
    return (
      <div className="dashboard-content">
        No active church selected.
      </div>
    );
  }

  if (!canManageRoles) {
    return (
      <div className="dashboard-content">
        You do not have permission to manage role requests.
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-header">
        <div>
          <h2 className="card-title">
            Role Change Requests
          </h2>

          <p className="text-muted">
            Active Church:{" "}
            {activeMembership?.church?.name || "Unknown"}
          </p>
        </div>
      </div>

      {error && <p className="text-error">{error}</p>}

      {requests.length === 0 ? (
        <p className="text-muted">
          No pending role requests.
        </p>
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
                      <td>
                        {req.target_user?.full_name || "—"}
                      </td>

                      <td>
                        {req.target_membership?.role || "—"}
                      </td>

                      <td>
                        <strong>
                          {req.requested_role || "—"}
                        </strong>
                      </td>

                      <td>
                        {req.requester?.full_name || "System"}
                      </td>

                      <td>
                        <div className="table-actions">
                          <button
                            className="btn btn-primary"
                            disabled={
                              processingId === req.id
                            }
                            onClick={() =>
                              handleRoleRequest(
                                req,
                                "approved"
                              )
                            }
                          >
                            {processingId === req.id
                              ? "Processing..."
                              : "Approve"}
                          </button>

                          <button
                            className="btn btn-secondary"
                            disabled={
                              processingId === req.id
                            }
                            onClick={() =>
                              handleRoleRequest(
                                req,
                                "rejected"
                              )
                            }
                          >
                            {processingId === req.id
                              ? "Processing..."
                              : "Reject"}
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
              <div
                key={req.id}
                className="member-card"
              >
                <h3>
                  {req.target_user?.full_name || "—"}
                </h3>

                <p>
                  <strong>Current:</strong>{" "}
                  {req.target_membership?.role || "—"}
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
                    disabled={
                      processingId === req.id
                    }
                    onClick={() =>
                      handleRoleRequest(
                        req,
                        "approved"
                      )
                    }
                  >
                    {processingId === req.id
                      ? "Processing..."
                      : "Approve"}
                  </button>

                  <button
                    className="btn btn-secondary"
                    disabled={
                      processingId === req.id
                    }
                    onClick={() =>
                      handleRoleRequest(
                        req,
                        "rejected"
                      )
                    }
                  >
                    {processingId === req.id
                      ? "Processing..."
                      : "Reject"}
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
