// src/components/Sidebar.jsx
import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ChurchSwitcher from "./ChurchSwitcher";
import sdaLogo from "../assets/sda-logo.png";
import "../styles/layout.css";

import {
  LayoutDashboard,
  Users,
  Baby,
  Wallet,
  Church,
  Megaphone,
  Shield,
  User,
  X,
  Music,
  BookOpen,
  HeartHandshake,
  HandHelping,
  ClipboardList,
} from "lucide-react";

const SIDEBAR_ITEMS = [
  // 🔹 CORE
  {
    label: "Home",
    path: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Profile",
    path: "/dashboard/profiles",
    icon: User,
  },

  // 🔹 LEADERSHIP
  {
    label: "Pastor",
    path: "/dashboard/pastor",
    icon: Church,
    permission: "access_pastor_dashboard",
  },
  {
    label: "Treasury",
    path: "/dashboard/treasury",
    icon: Wallet,
    permission: "access_treasury_dashboard",
  },
  {
    label: "Communication",
    path: "/dashboard/communication",
    icon: Megaphone,
    permission: "access_media_dashboard",
  },

  // 🔹 MINISTRIES
  {
    label: "Choir",
    path: "/dashboard/choir",
    icon: Music,
    permission: "access_choir_dashboard",
  },
  {
    label: "Youth",
    path: "/dashboard/youth",
    icon: Users,
    permission: "access_youth_dashboard",
  },
  {
    label: "Children",
    path: "/dashboard/children",
    icon: Baby,
    permission: "access_children_dashboard",
  },
  {
    label: "ALO",
    path: "/dashboard/alo",
    icon: BookOpen,
    permission: "access_alo_dashboard",
  },
  {
    label: "AMO",
    path: "/dashboard/amo",
    icon: HeartHandshake,
    permission: "access_amo_dashboard",
  },
  {
    label: "Church Clerk",
    path: "/dashboard/clerk",
    icon: ClipboardList,
    permission: "access_clerk_dashboard",
  },
  {
    label: "Sabbath School",
    path: "/dashboard/s-school",
    icon: BookOpen,
    permission: "access_s_school_dashboard",
  },
  {
    label: "Deaconry",
    path: "/dashboard/deaconry",
    icon: HandHelping,
    permission: "access_deaconry_dashboard",
  },

  // 🔹 SYSTEM
  {
    label: "Admin",
    path: "/dashboard/admin",
    icon: Shield,
    permission: "access_admin_dashboard",
  },
];

export default function Sidebar({ open, onClose, onLogout, }) {
  const {
    user,
    activeChurch,
    canUser,
  } = useAuth();

  if (!user) return null;

  const isGuest = !user?.is_member;

  const churchName =
    activeChurch?.name ||
    "Seventh-day Adventist Church";

  const visibleItems = SIDEBAR_ITEMS.filter((item) => {
    // public routes
    if (!item.permission) return true;

    // guests cannot access protected areas
    if (isGuest) return false;

    // permission-driven visibility
    return canUser(item.permission);
  });

  return (
    <aside className={`sidebar ${open ? "open" : ""}`}>
      {/* Header */}
      <div className="sidebar-header">
        <div className="sidebar-brand">
          <img
            src={sdaLogo}
            alt="SDA Logo"
            className="sidebar-logo"
          />

          <div className="sidebar-brand-text">
            <ChurchSwitcher />

            <small className="sidebar-church-name">
              {churchName}
            </small>

            {isGuest && (
              <span className="sidebar-status">
                {user.membership_status === "requested"
                  ? "Pending approval"
                  : user.membership_status === "invited"
                  ? "Invitation received"
                  : "Guest"}
              </span>
            )}
          </div>
        </div>

        <button
          className="close-btn"
          onClick={onClose}
        >
          <X size={20} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="sidebar-links">
        {visibleItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={({ isActive }) =>
                isActive
                  ? "sidebar-link active"
                  : "sidebar-link"
              }
            >
              <Icon
                size={18}
                className="sidebar-icon"
              />

              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>
{/* Footer */}
<div className="sidebar-footer">
  <button
    onClick={onLogout}
    className="btn btn-secondary sidebar-logout"
  >
    Logout
  </button>
</div>
    </aside>
  );
}
