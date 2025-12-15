import { Link } from "react-router-dom";
import "../styles/global.css";

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <h2 className="sidebar-title">ChurchApp</h2>

      <nav className="sidebar-links">
        <Link to="/dashboard">Overview</Link>
        <Link to="/dashboard/youth">Youth</Link>
        <Link to="/dashboard/children">Children</Link>
        <Link to="/dashboard/treasury">Treasury</Link>
        <Link to="/dashboard/pastor">Pastor</Link>
      </nav>

      <Link to="/dashboard/settings/profiles" className="sidebar-profile-link">
        Profile
      </Link>
    </aside>
  );
}
