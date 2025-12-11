// src/components/Sidebar.jsx
import { Link } from "react-router-dom";
import "./Sidebar.css";

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <h2 className="sidebar-title">ChurchApp</h2>

      <nav className="sidebar-links">
        <Link to="/dashboard">Overview</Link>
        <Link to="/dashboard/youth">Youth</Link>
        <Link to="/dashboard/children">Children</Link>
        <Link to="/dashboard/treasury">Treasury</Link>
        <Link to="/dashboard/comms">Communication</Link>
        <Link to="/dashboard/pastor">Pastor</Link>
      </nav>

      <Link to="/dashboard/profile" className="sidebar-profile-link">
        Profile
      </Link>
    </aside>
  );
}