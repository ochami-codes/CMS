import { useEffect, useState } from "react";
import { AdminAPI } from "../../utils/api";
import { useToast } from "../../components/ToastProvider";
import Loader from "../../components/Loader";
import "../../styles/pages.css";

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
  const handleInvite = async (profile_id) => {
    setActionLoading((prev) => ({ ...prev, [profile_id]: true }));

    try {
      await AdminAPI.sendInvite(profile_id);
      showToast("Invite sent successfully");
      await loadNonMembers();
    } catch (err) {
      console.error("Failed to send invite:", err);
      showToast(err.message || "Failed to send invite", "error");
    } finally {
      setActionLoading((prev) => ({ ...prev, [profile_id]: false }));
    }
  };

  /* ------------------ Render Action Cell ------------------ */
  const renderActionCell = (p) => {
    if (p.source === "user_request" && p.status === "requested") {
      return <span className="status-label status-warning">Request Pending</span>;
    }

    if (p.source === "admin_invite" && p.status === "invited") {
      return <span className="status-label status-info">Invite Sent</span>;
    }

    return (
      <button
        className="btn btn-primary btn-role-request"
        disabled={actionLoading[p.profile_id]}
        onClick={() => handleInvite(p.profile_id)}
      >
        {actionLoading[p.profile_id] ? "Inviting…" : "Invite"}
      </button>
    );
  };

  /* ------------------ Loading & Empty States ------------------ */
  if (loading) return <Loader message="Loading non-members…" />;

  if (!data.length) {
    return (
      <div className="page-card">
        <h3 className="card-title">Non-Members</h3>
        <p className="text-muted">No non-members found 🎉</p>
      </div>
    );
  }

  /* ------------------ Main Table ------------------ */
  return (
    <div className="page-container">
      <div className="page-card">
        <h3 className="card-title">Non-Members</h3>

        <div className="table-responsive">
          <table className="members-table">
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
                    <span className="status-label status-nonmember">
                      Not a member
                    </span>
                  </td>

                  <td>{renderActionCell(p)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
