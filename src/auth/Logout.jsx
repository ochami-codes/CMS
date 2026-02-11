// src/auth/Logout.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/auth.css";

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
    <div className="auth-container">
      <div className="auth-card flex flex-col items-center gap-4">
        <h2 className="text-center">Logging out…</h2>
        <div className="loader"></div>
        <p className="text-center text-gray-600">
          Please wait while we sign you out.
        </p>
      </div>
    </div>
  );
}
