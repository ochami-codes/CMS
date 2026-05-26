import { Outlet, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Inbox, Menu } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import Sidebar from "../components/Sidebar";
import NotificationBell from "../components/NotificationBell";
import Badge from "../components/Badge";
import useUnreadMessages from "../hooks/useUnreadMessages";
import styles from "../styles/layouts/DashboardLayout.module.css";

export default function DashboardLayout() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { unreadMessages } = useUnreadMessages();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className={styles.layout}>
      {/* Mobile hamburger */}
      <button
        className={styles.hamburger}
        onClick={() => setSidebarOpen(true)}
        aria-label="Open menu"
      >
        <Menu size={22} />
      </button>

      <Sidebar 
        open={sidebarOpen} 
        onClose={() => setSidebarOpen(false)}
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed(!collapsed)}
        onLogout={handleLogout}
      />

      {/* MAIN */}
      <div 
        className={styles.main}
        style={{ 
          marginLeft: collapsed ? 72 : 260,
        }}
      >
        {/* NAVBAR */}
        <header className={styles.navbar}>
          <h3 className={styles.title}>ChurchApp</h3>

          <div className={styles.icons}>
            {/* Messages */}
            <button
              className={styles.iconBtn}
              onClick={() => navigate("/dashboard/messages")}
              aria-label="Messages"
            >
              <Inbox size={20} />
              {unreadMessages > 0 && (
                <Badge type="danger">{unreadMessages}</Badge>
              )}
            </button>

            {/* Notifications */}
            <NotificationBell />
          </div>
        </header>

        {/* PAGE CONTENT */}
        <section className={styles.page}>
          <Outlet />
        </section>
      </div>
    </div>
  );
}
