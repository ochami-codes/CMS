// src/layouts/DashboardLayout.jsx
import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Sidebar from "../components/Sidebar";

export default function DashboardLayout() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <main className="dashboard-content">
        {/* Top bar */}
        <header className="dashboard-navbar">
          <h3>Dashboard</h3>

          <button
            onClick={handleLogout}
            className="btn btn-secondary"
          >
            Logout
          </button>
        </header>

        {/* Routed pages */}
        <section className="dashboard-page">
          <Outlet />
        </section>
      </main>
    </div>
  );
}
