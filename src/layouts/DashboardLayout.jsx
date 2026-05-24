import {
  Outlet,
  useNavigate,
} from "react-router-dom";

import { useState } from "react";

import { Inbox } from "lucide-react";

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

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className={styles.layout}>

      {/* HAMBURGER */}
      <button
        className={styles.hamburger}
        onClick={() =>
          setSidebarOpen(prev => !prev)
        }
      >
        ☰
      </button>

      {/* SIDEBAR */}
      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onLogout={handleLogout}
      />

      {/* OVERLAY */}
      {sidebarOpen && (
        <div
          className={styles.overlay}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* MAIN */}
      <div className={styles.main}>

        {/* NAVBAR */}
        <header className={styles.navbar}>

          <h3 className={styles.title}>
            ChurchApp
          </h3>

          <div className={styles.icons}>

            {/* Messages */}
            <button
              className={styles.iconBtn}
              onClick={() =>
                navigate("dashboard/messages")
              }
            >

              <Inbox size={20} />

              {unreadMessages > 0 && (
                <Badge type="danger">
                  {unreadMessages}
                </Badge>
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
