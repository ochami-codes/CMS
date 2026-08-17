import { Outlet, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Mail, Menu } from "lucide-react";

import { useAuth } from "../context/AuthContext";

import Sidebar from "../components/Sidebar";
import Badge from "../components/Badge";
import NotificationBell from "../components/NotificationBell";

import useUnreadMessages from "../hooks/messages/useUnreadMessages";

import styles from "../styles/layouts/DashboardLayout.module.css";

export default function DashboardLayout() {
  const { logout, dashboardMode } = useAuth();
  const navigate = useNavigate();

  const enabled = dashboardMode === "member";

  const { unreadMessages } =
    useUnreadMessages(enabled);

  const [sidebarOpen, setSidebarOpen] =
    useState(false);

  const [collapsed, setCollapsed] =
    useState(false);

  const [isScrolling, setIsScrolling] =
    useState(false);

  /* -------------------------
     Show menu while scrolling
  ------------------------- */

  useEffect(() => {
    let timeout;

    const handleScroll = () => {
      setIsScrolling(true);

      clearTimeout(timeout);

      timeout = setTimeout(() => {
        setIsScrolling(false);
      }, 5000);
    };

    window.addEventListener(
      "scroll",
      handleScroll,
      { passive: true }
    );

    return () => {
      window.removeEventListener(
        "scroll",
        handleScroll
      );

      clearTimeout(timeout);
    };
  }, []);

  /* -------------------------
     Logout
  ------------------------- */

  const handleLogout = async () => {
    await logout();

    navigate("/login", {
      replace: true,
    });
  };

  return (
    <div className={styles.layout}>

      {/* Mobile menu */}
      {!sidebarOpen && isScrolling && (
        <button
  className={`${styles.hamburger} ${
    isScrolling ? styles.hamburgerVisible : ""
  }`}
  onClick={() => setSidebarOpen(true)}
  aria-label="Open menu"
  aria-hidden={!isScrolling}
>
  <Menu size={22} />
</button>
      )}

      <Sidebar
        open={sidebarOpen}
        onClose={() =>
          setSidebarOpen(false)
        }
        collapsed={collapsed}
        onToggleCollapse={() =>
          setCollapsed(!collapsed)
        }
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

          <div className={styles.brand}>
            <span
              className={styles.brandName}
            >
              Church<span>App</span>
            </span>
          </div>

          <div className={styles.icons}>

            {/* Messages */}
            <button
              className={styles.iconBtn}
              onClick={() =>
                navigate(
                  "/dashboard/messages"
                )
              }
              aria-label="Messages"
            >
              <Mail size={20} />

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