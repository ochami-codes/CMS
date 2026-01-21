// src/auth/CallbackSuccess.jsx
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function CallbackSuccess() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");
    const user = params.get("user");

    if (!token) {
      navigate("/login", { replace: true });
      return;
    }

    localStorage.setItem("token", token);
    if (user) {
      try {
        localStorage.setItem("user", JSON.stringify(JSON.parse(user)));
      } catch {
        localStorage.setItem("user", user);
      }
    }

    // Clean URL
    window.history.replaceState({}, document.title, "/dashboard");
    navigate("/dashboard", { replace: true });
  }, [location, navigate]);

  return (
    <div className="flex items-center justify-center h-screen">
      <p className="text-gray-600">Redirecting…</p>
    </div>
  );
}
