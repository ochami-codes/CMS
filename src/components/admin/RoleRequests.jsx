import {
  useEffect,
  useState,
  useCallback,
} from "react";

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
    hasRole,
  } = useAuth();

  const { showToast } =
    useToast();

  const [requests, setRequests] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [
    processingId,
    setProcessingId,
  ] = useState(null);

  /* ---------------- Permissions ---------------- */

  const canManageRoles =
    hasRole("admin") ||
    hasRole("elder") ||
    hasRole("pastor");

  /* ---------------- Fetch ---------------- */

  const fetchRequests =
    useCallback(async () => {
      if (
        !authReady ||
        !activeChurchId ||
        !canManageRoles
      ) {
        setLoading(false);
        setRequests([]);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const { requests } =
          await AdminAPI.fetchRoleRequests();

        setRequests(
          Array.isArray(requests)
            ? requests
            : []
        );

      } catch (err) {
        const message =
          err?.message ||
          "Failed to load role requests";

        setError(message);

        showToast(
          message,
          "error"
        );

        setRequests([]);

      } finally {
        setLoading(false);
      }
    }, [
      authReady,
      activeChurchId,
      canManageRoles,
      showToast,
    ]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  /* ---------------- Review ---------------- */

  const handleReview =
    async (
      request,
      action
    ) => {
      try {
        setProcessingId(
          request.id
        );

        await AdminAPI.reviewRoleRequest(
          request.id,
          action
        );

        setRequests((prev) =>
          prev.filter(
            (r) =>
              r.id !== request.id
          )
        );

        showToast(
          `${
            action === "approved"
              ? "Approved"
              : "Rejected"
          } role request for ${
            request.full_name
          }`,
          "success"
        );

      } catch {
        showToast(
          "Failed to process request",
          "error"
        );

      } finally {
        setProcessingId(null);
      }
    };

  /* ---------------- Guards ---------------- */

  if (!authReady || loading) {
    return (
      <div className="dashboard-content">
        Loading role requests...
      </div>
    );
  }

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
        No permission.
      </div>
    );
  }

  return (
    <div className="card">

      <div className="card-header">
        <h2 className="card-title">
          Role Requests
        </h2>
      </div>

      {error && (
        <p className="text-error">
          {error}
        </p>
      )}

      {!requests.length ? (
        <p className="text-muted">
          No pending requests.
        </p>
      ) : (
        <>
          {/* ===== Desktop ===== */}

          <div className="desktop-table">

            <div className="table-scroll">

              <table className="members-table">

                <thead>
                  <tr>
                    <th>Name</th>

                    <th>Email</th>

                    <th>
                      Requested Role
                    </th>

                    <th>Date</th>

                    <th>
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>

                  {requests.map(
                    (req) => (
                      <tr
                        key={req.id}
                      >
                        <td>
                          {req.full_name}
                        </td>

                        <td>
                          {req.email}
                        </td>

                        <td>
                          <strong>
                            {
                              req.requested_role
                            }
                          </strong>
                        </td>

                        <td>
                          {new Date(
                            req.role_requested_at
                          ).toLocaleDateString()}
                        </td>

                        <td>

                          <div className="table-actions">

                            <button
                              className="btn btn-primary"

                              disabled={
                                processingId ===
                                req.id
                              }

                              onClick={() =>
                                handleReview(
                                  req,
                                  "approved"
                                )
                              }
                            >
                              Approve
                            </button>

                            <button
                              className="btn btn-secondary"

                              disabled={
                                processingId ===
                                req.id
                              }

                              onClick={() =>
                                handleReview(
                                  req,
                                  "rejected"
                                )
                              }
                            >
                              Reject
                            </button>

                          </div>

                        </td>

                      </tr>
                    )
                  )}

                </tbody>

              </table>

            </div>

          </div>

          {/* ===== Mobile ===== */}

          <div className="mobile-cards">

            {requests.map(
              (req) => (
                <div
                  key={req.id}
                  className="member-card"
                >

                  <h3>
                    {req.full_name}
                  </h3>

                  <p>
                    <strong>
                      Email:
                    </strong>{" "}
                    {req.email}
                  </p>

                  <p>
                    <strong>
                      Requested:
                    </strong>{" "}
                    {
                      req.requested_role
                    }
                  </p>

                  <p>
                    <strong>
                      Date:
                    </strong>{" "}
                    {new Date(
                      req.role_requested_at
                    ).toLocaleDateString()}
                  </p>

                  <div className="card-actions">

                    <button
                      className="btn btn-primary"

                      disabled={
                        processingId ===
                        req.id
                      }

                      onClick={() =>
                        handleReview(
                          req,
                          "approved"
                        )
                      }
                    >
                      Approve
                    </button>

                    <button
                      className="btn btn-secondary"

                      disabled={
                        processingId ===
                        req.id
                      }

                      onClick={() =>
                        handleReview(
                          req,
                          "rejected"
                        )
                      }
                    >
                      Reject
                    </button>

                  </div>

                </div>
              )
            )}

          </div>
        </>
      )}
    </div>
  );
}
