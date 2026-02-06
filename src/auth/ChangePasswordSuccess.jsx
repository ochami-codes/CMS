// src/auth/ChangePasswordSuccess.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import EncouragementRedirect from "../components/EncouragementRedirect";

export default function ChangePasswordSuccess() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // 🔐 Logout immediately (no timer)
    logout();
  }, [logout]);

  return (
    <EncouragementRedirect
      title="Password updated 🔐"
      message="Your password has been changed successfully. Please sign in again."
      redirectTo="/login"
      delay={8000} // redirect only
    />
  );
}
