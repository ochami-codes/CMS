// src/auth/Logout.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Logout() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const doLogout = async () => {
      await logout();
      navigate("/login", { replace: true });
    };

    doLogout();
  }, []);

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <p>Logging out...</p>
    </div>
  );
}
