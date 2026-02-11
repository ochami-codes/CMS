import { NavLink } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { canUser } from "../utils/permissions";
import {
  LayoutDashboard,
  Users,
  Baby,
  Wallet,
  Church,
  Megaphone,
  Shield,
  User,
  Menu,
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
];

export default function Sidebar({ open, onClose }) {
  const { profile } = useAuth();

  if (!profile) return null;

  return (
    <>
      {/* Sidebar */}
      <aside className={`sidebar ${open ? "open" : ""}`}>
        {/* Header */}
        <div className="sidebar-header">
          <h2 className="sidebar-title">ChurchApp</h2>
          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Links */}
        <nav className="sidebar-links">
          {SIDEBAR_ITEMS
            .filter(
              item =>
                !item.permission ||
                canUser(profile.role_name, item.permission)
            )
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

        {/* Profile */}
        <NavLink
          to="/dashboard/profiles"
          className="sidebar-profile-link"
          onClick={onClose}
        >
          <User size={18} />
          <span>Profile</span>
        </NavLink>
      </aside>
    </>
  );
}
