// src/auth/ChangePasswordSuccess.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import EncouragementRedirect from "../components/EncouragementRedirect";

export default function ChangePasswordSuccess() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [secondsLeft, setSecondsLeft] = useState(15); // 15 seconds countdown

  useEffect(() => {
    // 🔐 Logout immediately
    logout();

    // Countdown timer
    const timer = setInterval(() => {
      setSecondsLeft((s) => s - 1);
    }, 1000);

    // Redirect when countdown reaches 0
    const redirectTimeout = setTimeout(() => {
      navigate("/login", { replace: true });
    }, 15000);

    return () => {
      clearInterval(timer);
      clearTimeout(redirectTimeout);
    };
  }, [logout, navigate]);

  return (
    <EncouragementRedirect
      title="Password updated 🔐"
      message={`Your password has been changed successfully. Redirecting to login in ${secondsLeft} seconds...`}
      redirectTo="/login"
      delay={15000} // fallback for redirect
    />
  );
}
