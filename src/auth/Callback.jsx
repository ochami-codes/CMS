// src/auth/Callback.jsx
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthAPI } from "../utils/api";

export default function Callback() {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const handleCallback = async () => {
      const params = new URLSearchParams(location.search);
      const access_token = params.get("access_token");
      const refresh_token = params.get("refresh_token");
      const type = params.get("type") || "";

      if (!access_token || !refresh_token) {
        navigate("/login", { replace: true });
        return;
      }

      try {
        // Call backend to handle Supabase callback, generate JWT
        const res = await AuthAPI.callback({ access_token, refresh_token, type });

        if (res?.token) {
          localStorage.setItem("token", res.token);
          if (res.user) {
            localStorage.setItem("user", JSON.stringify(res.user));
          }

          // Redirect to dashboard
          navigate("/dashboard", { replace: true });
        } else {
          setError("Failed to sign in. Please try logging in manually.");
        }
      } catch (err) {
        console.error("Callback error:", err);
        setError("Server error during authentication. Try again.");
      } finally {
        setLoading(false);
      }
    };

    handleCallback();
  }, [location, navigate]);

  return (
    <div className="flex items-center justify-center h-screen">
      {loading && <p className="text-gray-600">Signing you in…</p>}
      {error && <p className="text-red-600 text-center">{error}</p>}
    </div>
  );
}
