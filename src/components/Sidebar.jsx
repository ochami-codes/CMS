// src/components/Sidebar.jsx
import { Link } from "react-router-dom";
import "./Sidebar.css";

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <h2 className="sidebar-title">ChurchApp</h2>

      <nav className="sidebar-links">
        <Link to="/Dashboard">Overview</Link>
        <Link to="/pages/youth/YouthDashboard">Youth</Link>
        <Link to="/pages/children/ChildrenDashboard">Children</Link>
        <Link to="/pages/treasury/TreasuryDashboard">Treasury</Link>
        <Link to="/pages/pastor/PastorDashboard">Pastor</Link>
      </nav>

      <Link to="/pages/settings/profile" className="sidebar-profile-link">
        Profile
      </Link>
    </aside>
  );
}
