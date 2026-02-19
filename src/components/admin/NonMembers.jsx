import { useEffect, useState } from "react";
import { AdminDashboardAPI, AdminAPI } from "../../utils/api";
import Loader from "../../components/Loader";
import "../../styles/pages.css";

export default function NonMembers() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState({}); // per-row button

  const loadNonMembers = async () => {
    try {
      setLoading(true);
      const res = await AdminDashboardAPI.fetchAll();

      const nonMembers = (res?.data || []).filter(
        (p) => !p.is_member && p.membership_request_status !== "pending"
      );

      setData(nonMembers);
    } catch (err) {
      console.error("Failed to load non-members:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNonMembers();
  }, []);

  const handleInvite = async (id) => {
    setActionLoading((prev) => ({ ...prev, [id]: true }));
    try {
      await AdminAPI.sendInvite(id);
      loadNonMembers(); // remove invited user
    } catch (err) {
      alert(err.message || "Failed to send invite");
    } finally {
      setActionLoading((prev) => ({ ...prev, [id]: false }));
    }
  };

  if (loading) return <Loader message="Loading non-members…" />;

  if (!data.length)
    return (
      <div className="page-card">
        <h3 className="card-title">Non-Members</h3>
        <p className="text-muted">No non-members found 🎉</p>
      </div>
    );

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
                <th>Church</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {data.map((p) => (
                <tr key={p.id}>
                  <td>{p.full_name || "-"}</td>
                  <td>{p.email || "-"}</td>
                  <td>{p.phone || "-"}</td>
                  <td>{p.church_name || "-"}</td>
                  <td>
                    <span className="status-label status-nonmember">
                      Not a member
                    </span>
                  </td>
                  <td>
                    <button
                      className="btn btn-primary btn-role-request"
                      disabled={actionLoading[p.id]}
                      onClick={() => handleInvite(p.id)}
                    >
                      {actionLoading[p.id] ? "Inviting…" : "Invite"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
