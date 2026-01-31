// src/layouts/DashboardLayout.jsx
import { Outlet, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
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
      <Navbar title="Dashboard" />

      <div className="dashboard-body">
        {/* Sidebar */}
         <Sidebar />

        {/* Main Content */}
        <main className="dashboard-content">
          {/* Top mini navbar */}
          <header className="dashboard-navbar">
            <h3>Dashboard</h3>

            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          </header>

          {/* Nested routed pages */}
          <section className="dashboard-page">
            <Outlet />
          </section>
        </main>
      </div>
    </div>
  );
}