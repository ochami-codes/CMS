import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { canUser } from "../utils/permissions";
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
} from "lucide-react";

const SIDEBAR_ITEMS = [
  {
    label: "Home",
    path: "/dashboard",
    icon: LayoutDashboard,
    permission: null,
  },
  {
    label: "Youth",
    path: "/dashboard/youth",
    icon: Users,
    permission: "manage_youth",
  },
  {
    label: "Children",
    path: "/dashboard/children",
    icon: Baby,
    permission: "manage_children",
  },
  {
    label: "Treasury",
    path: "/dashboard/treasury",
    icon: Wallet,
    permission: "view_finances",
  },
  {
    label: "Pastor",
    path: "/dashboard/pastor",
    icon: Church,
    permission: "manage_departments",
  },
  {
    label: "Communication",
    path: "/dashboard/communication",
    icon: Megaphone,
    permission: "manage_announcements",
  },
  {
    label: "Admin",
    path: "/dashboard/admin",
    icon: Shield,
    permission: "manage_users",
  },
  {
    label: "Profile",
    path: "/dashboard/profile",
    icon: User,
    permission: null,
  },
];

export default function Sidebar({ open, onClose }) {
  const { profile } = useAuth();

  if (!profile) return null;

  const isMember = profile.is_member;
  const churchName = profile.church_name || "Seventh-day Adventist Church";

  return (
    <aside className={`sidebar ${open ? "open" : ""}`}>
      {/* Header */}
      <div className="sidebar-header">
        <div className="sidebar-brand">
          <img
            src="/logo/sda-logo.png"
            alt="SDA Logo"
            className="sidebar-logo"
          />
          <div className="sidebar-brand-text">
            <span className="sidebar-church-name">{churchName}</span>
            {!isMember && (
              <span className="sidebar-status">Pending approval</span>
            )}
          </div>
        </div>

        <button className="close-btn" onClick={onClose}>
          <X size={20} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="sidebar-links">
        {SIDEBAR_ITEMS
          .filter(item => {
            if (!item.permission) return true;
            if (!isMember) return false;
            return canUser(profile.role_name, item.permission);
          })
          .map(item => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  isActive ? "sidebar-link active" : "sidebar-link"
                }
              >
                <Icon size={18} className="sidebar-icon" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
      </nav>
    </aside>
  );
}
