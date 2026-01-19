// src/auth/CallbackSuccess.jsx
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function CallbackSuccess() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");
    const user = params.get("user"); // optional (JSON string or id)

    // No token → force login
    if (!token) {
      navigate("/login", { replace: true });
      return;
    }

    // ✅ Store auth token
    localStorage.setItem("token", token);

    // ✅ Optional user payload
    if (user) {
      try {
        localStorage.setItem("user", user);
      } catch {
        // ignore malformed user payload
      }
    }

    // ✅ Clean URL (remove sensitive params)
    window.history.replaceState({}, document.title, "/dashboard");

    // ✅ Redirect to dashboard
    navigate("/dashboard", { replace: true });
  }, [location, navigate]);

  return (
    <div className="flex items-center justify-center h-screen">
      <p className="text-gray-600">Signing you in…</p>
    </div>
  );
}
