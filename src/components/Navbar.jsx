// src/components/Navbar.jsx
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import "../styles/global.css";
export default function Navbar({ title = "Dashboard" }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="dashboard-navbar">
      <h3>{title}</h3>

      <div className="nav-right">
        <span className="user-email">{user?.email}</span>

        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
}
