// src/layouts/DashboardLayout.jsx
import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import NotificationBell from "../components/NotificationBell";
import Sidebar from "../components/Sidebar";
import { useState } from "react";
import "../styles/layout.css";
export default function DashboardLayout() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="dashboard-layout">
      {/* Hamburger for mobile */}
      <button
        className="hamburger-btn"
        onClick={toggleSidebar}
        aria-label="Toggle sidebar"
      >
        ☰
      </button>

      {/* Sidebar */}
      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onLogout={handleLogout}
      />

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <main className="dashboard-content">
        {/* Navbar */}
<header className="dashboard-navbar">
  {/* Top row */}
  <div className="navbar-top">
    <h3>Dashboard</h3>

    <div className="navbar-icons">
      <NotificationBell />
    </div>
  </div>
</header>
        {/* Routed pages */}
        <section className="dashboard-page">
          <Outlet />
        </section>
      </main>
    </div>
  );
}
