// src/pages/Onboarding.jsx
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "../styles/pages.css";

export default function Onboarding() {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) return <div> Loading...</div>;
  const activeMembership =
  memberships.find((m) => m.status === "active") || null;
  const isAdmin =
  activeMembership?.roles?.includes("admin") || false;
  const isGuest = !user.is_member || user.membership_status !== "approved";

  const memberships = user.memberships || [];


const defaultChurchId = activeMembership?.church_id;

  const handleGoToDashboard = () => {
    if (defaultChurchId) {
      navigate("/dashboard");
    }
  };

  const handleOpenChurch = (churchId) => {
    // optional: set active church via API later
    navigate("/dashboard");
  };

  const handleCreateChurch = () => {
    navigate("/create-church");
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

      {/* ---------- Context Card ---------- */}
      <div className="page-card">
        {isAdmin && activeMembership && (
          <>
            <h3 className="card-title">You're the Admin</h3>
            <p>
              You are the administrator of{" "}
              <strong>{activeMembership.church_name}</strong>.
            </p>

            <div className="actions">
              <button
                className="btn btn-primary"
                onClick={handleGoToDashboard}
              >
                Go to Dashboard
              </button>
            </div>
          </>
        )}

        {isGuest && (
          <>
            <h3 className="card-title">Guest Access</h3>
            <p>
              You are registered as a guest. An admin manages this church.
              You can request membership from the dashboard.
            </p>

            <div className="actions">
              <button
                className="btn btn-primary"
                onClick={handleGoToDashboard}
              >
                Go to Dashboard
              </button>
            </div>
          </>
        )}

        {!isAdmin && !isGuest && memberships.length === 0 && (
          <>
            <h3 className="card-title">Welcome</h3>
            <p>
              You are not yet a member of any church.
            </p>
          </>
        )}
      </div>

      {/* ---------- My Churches ---------- */}
      {memberships.length > 0 && (
        <div className="page-card">
          <h3 className="card-title">My Churches</h3>

          <div className="actions">
            {memberships.map((m) => (
              <div
                key={m.id}
                className="dashboard-action-card"
              >
                <h3>{m.church_name}</h3>
                <p>Status: {m.status}</p>

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

      {/* ---------- Create Church ---------- */}
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
