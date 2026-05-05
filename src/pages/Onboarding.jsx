import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { ChurchAPI } from "../utils/api";
import "../styles/pages.css";

export default function Onboarding() {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) return <div>Loading...</div>;

  const memberships = user.memberships || [];

  const activeMemberships = memberships.filter(
    (m) => m.status === "active"
  );

  const pendingMemberships = memberships.filter(
    (m) => m.status !== "active"
  );

  const handleOpenChurch = async (churchId) => {
  try {
    await ChurchAPI.setActiveChurch({
      church_id: churchId,
      profile_id: user.id,
    });

    navigate("/dashboard");
  } catch (err) {
    console.error(err);
  }
};

  const handleCreateChurch = () => {
    navigate("/create-church");
  };

  const handleJoinChurch = () => {
    navigate("/join-church");
  };

  return (
    <div className="page-container">

      {/* ---------- Welcome ---------- */}
      <div className="page-card">
        <h2 className="card-title">
          Welcome back, {user.full_name || "User"} 👋
        </h2>
        <p className="card-subtitle">
          Choose how you'd like to continue
        </p>
      </div>

      {/* ---------- Active Churches ---------- */}
      {activeMemberships.length > 0 && (
        <div className="page-card">
          <h3 className="card-title">Your Churches</h3>

          <div className="actions">
            {activeMemberships.map((m) => (
              <div key={m.id} className="dashboard-action-card">
                <h3>{m.church_name}</h3>

                <button
                  className="btn btn-primary"
                  onClick={() => handleOpenChurch(m.church_id)}
                >
                  Open
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ---------- Pending ---------- */}
      {pendingMemberships.length > 0 && (
        <div className="page-card">
          <h3 className="card-title">Pending Requests</h3>

          <div className="actions">
            {pendingMemberships.map((m) => (
              <div key={m.id} className="dashboard-action-card">
                <h3>{m.church_name}</h3>
                <p>Status: {m.status}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ---------- No Membership ---------- */}
      {memberships.length === 0 && (
        <div className="page-card">
          <h3 className="card-title">Get Started</h3>
          <p>You are not part of any church yet.</p>
        </div>
      )}

      {/* ---------- JOIN CHURCH (NEW) ---------- */}
      <div className="page-card">
        <h3 className="card-title">Join an Existing Church</h3>
        <p className="card-subtitle">
          Search for your church and request to join.
        </p>

        <div className="actions">
          <button
            className="btn btn-primary"
            onClick={handleJoinChurch}
          >
            🔍 Join Church
          </button>
        </div>
      </div>

      {/* ---------- CREATE CHURCH ---------- */}
      <div className="page-card">
        <h3 className="card-title">Start Something New</h3>
        <p className="card-subtitle">
          Create a new church and become its administrator.
        </p>

        <div className="actions">
          <button
            className="btn btn-secondary"
            onClick={handleCreateChurch}
          >
            ➕ Create New Church
          </button>
        </div>
      </div>

    </div>
  );
}
