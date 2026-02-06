// src/auth/ChangePasswordSuccess.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import EncouragementRedirect from "../components/EncouragementRedirect";

export default function ChangePasswordSuccess() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  return (
    <EncouragementRedirect
      title="Password updated 🔐"
      message="Your password has been changed successfully. You’ll be redirected to sign in again."
      redirectTo="/login"
      delay={10000}
      onComplete={async () => {
        await logout(); // logout AFTER encouragement
      }}
    />
  );
}
