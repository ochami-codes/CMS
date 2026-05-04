// src/layouts/OnboardingLayout.jsx
import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/layout.css";

export default function OnboardingLayout() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="dashboard-layout">
      {/* Reuse same main container for consistency */}
      <main className="dashboard-content">
        
        {/* Minimal Navbar */}
        <header className="dashboard-navbar">
          <h3>Welcome</h3>

          <div className="navbar-actions">
            <span style={{ fontSize: "0.9rem", color: "#6b7280" }}>
              {user?.email}
            </span>

            <button onClick={handleLogout} className="btn btn-secondary">
              Logout
            </button>
          </div>
        </header>

        {/* Page content */}
        <section className="dashboard-page">
          <Outlet />
        </section>
      </main>
    </div>
  );
}
