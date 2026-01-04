// src/auth/Logout.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Logout() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const doLogout = async () => {
      await logout(); // calls backend /auth/logout and clears context
      navigate("/login", { replace: true });
    };

    doLogout();
  }, [logout, navigate]);

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <p>Logging out...</p>
    </div>
  );
}