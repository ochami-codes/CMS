import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { canUser } from "../utils/permissions";
import "../styles/global.css";

// Sidebar items with permissions
const SIDEBAR_ITEMS = [
  {
    label: "Overview",
    path: "/dashboard",
    permission: null,
  },
  {
    label: "Youth",
    path: "/dashboard/youth",
    permission: "manage_youth",
  },
  {
    label: "Children",
    path: "/dashboard/children",
    permission: "manage_children",
  },
  {
    label: "Treasury",
    path: "/dashboard/treasury",
    permission: "view_finances",
  },
  {
    label: "Pastor",
    path: "/dashboard/pastor",
    permission: "manage_departments",
  },
  {
    label: "Manage Roles",
    path: "/dashboard/manage-roles",
    permission: "manage_users", // admin-only
  },
];

export default function Sidebar() {
  const { profile } = useAuth();

  return (
    <aside className="sidebar">
      <h2 className="sidebar-title">ChurchApp</h2>

      <nav className="sidebar-links">
        {SIDEBAR_ITEMS.filter(item =>
          canUser(profile?.role, item.permission)
        ).map(item => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              isActive ? "active sidebar-link" : "sidebar-link"
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      <NavLink
        to="/dashboard/settings/profiles"
        className="sidebar-profile-link"
      >
        Profile
      </NavLink>
    </aside>
  );
}