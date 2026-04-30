import { useEffect, useState } from "react";
import { AdminAPI } from "../../utils/api";
import { useToast } from "../../components/ToastProvider";
import Loader from "../../components/Loader";
import "../../styles/pages.css";
import "../../styles/tables.css";

export default function NonMembers() {
  const { showToast } = useToast();

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState({});

  /* ------------------ Load Non-Members ------------------ */
  const loadNonMembers = async () => {
    try {
      setLoading(true);
      const res = await AdminAPI.fetchNonMembers();
      setData(res.non_members || []);
    } catch (err) {
      console.error("Failed to load non-members:", err);
      showToast("Failed to load non-members", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNonMembers();
  }, []);

  /* ------------------ Invite Action ------------------ */
  const handleInvite = async (profileId) => {
    setActionLoading((prev) => ({ ...prev, [profileId]: true }));

    try {
      await AdminAPI.sendInvite(profileId);
      showToast("Invite sent successfully");
      await loadNonMembers();
    } catch (err) {
      console.error("Failed to send invite:", err);
      showToast(err.message || "Failed to send invite", "error");
    } finally {
      setActionLoading((prev) => ({ ...prev, [profileId]: false }));
    }
  };

  /* ------------------ Helpers ------------------ */
  const getStatusLabel = (status) => {
    if (status === "invited") return "Invite Sent";
    if (status === "requested") return "Request Pending";
    return "Not a member";
  };

  const getStatusClass = (status) =>
    ["invited", "requested"].includes(status)
      ? "status-info"
      : "status-nonmember";

  const renderActionCell = (p) => {
    const status = p.membership_status;
    const isBlocked = ["invited", "requested"].includes(status);
    const isLoading = actionLoading[p.profile_id];

    return (
      <button
        className={`btn btn-role-request ${
          isBlocked ? "btn-disabled-custom" : "btn-primary"
        }`}
        disabled={isBlocked || isLoading}
        onClick={() => !isBlocked && handleInvite(p.profile_id)}
      >
        {isLoading
          ? "Inviting…"
          : status === "invited"
          ? "Invite Sent"
          : status === "requested"
          ? "Pending"
          : "Invite"}
      </button>
    );
  };

  /* ------------------ Loading & Empty ------------------ */
  if (loading) return <Loader message="Loading non-members…" />;

  if (!data.length) {
    return (
      <div className="page-card">
        <h3 className="card-title">Non-Members</h3>
        <p className="text-muted">No non-members found 🎉</p>
      </div>
    );
  }

  /* ------------------ Main UI ------------------ */
  return (
    <div className="page-container">
      <div className="page-card">
        <h3 className="card-title">Non-Members</h3>

        {/* -------- Desktop Table -------- */}
        <div className="desktop-table">
          <div className="table-scroll">
            <table className="non-members-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Membership</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {data.map((p) => (
                  <tr key={p.profile_id}>
                    <td>{p.full_name || "-"}</td>
                    <td>{p.email || "-"}</td>
                    <td>{p.phone || "-"}</td>

                    <td>
                      <span
                        className={`status-label ${getStatusClass(
                          p.membership_status
                        )}`}
                      >
                        {getStatusLabel(p.membership_status)}
                      </span>
                    </td>

                    <td>{renderActionCell(p)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* -------- Mobile Cards -------- */}
        <div className="mobile-cards">
          {data.map((p) => (
            <div key={p.profile_id} className="member-card">
              <h3>{p.full_name || "Unnamed"}</h3>

              <p>
                <strong>Email:</strong> {p.email || "-"}
              </p>
              <p>
                <strong>Phone:</strong> {p.phone || "-"}
              </p>

              <p>
                <strong>Status:</strong>{" "}
                <span
                  className={`status-label ${getStatusClass(
                    p.membership_status
                  )}`}
                >
                  {getStatusLabel(p.membership_status)}
                </span>
              </p>

              <div className="card-actions">
                {renderActionCell(p)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
