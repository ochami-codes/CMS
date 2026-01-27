import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { canUser } from "../utils/permissions";
import "../styles/global.css";

const SIDEBAR_ITEMS = [
  { label: "Overview", path: "/dashboard", permission: null },
  { label: "Youth", path: "/dashboard/youth", permission: "manage_youth" },
  { label: "Children", path: "/dashboard/children", permission: "manage_children" },
  { label: "Treasury", path: "/dashboard/treasury", permission: "view_finances" },
  { label: "Pastor", path: "/dashboard/pastor", permission: "manage_departments" },
  { label: "Communication", path: "/dashboard/communication", permission: "manage_announcements" },
  { label: "Admin", path: "/dashboard/admin", permission: "manage_users" },
];

export default function Sidebar() {
  const { profile } = useAuth();

  if (!profile) return null;

  return (
    <aside className="sidebar">
      <h2 className="sidebar-title">ChurchApp</h2>

      <nav className="sidebar-links">
        {SIDEBAR_ITEMS
          .filter(item => !item.permission || canUser(profile.role_name, item.permission))
          .map(item => (
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
        to="/dashboard/profiles"
        className="sidebar-profile-link"
      >
        Profile
      </NavLink>
    </aside>
  );
}
