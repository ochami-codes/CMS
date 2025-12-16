// src/pages/Unauthorized.jsx
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Unauthorized() {
  const navigate = useNavigate();
  const { profile } = useAuth();

  // Optional auto-redirect after 8 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/dashboard", { replace: true });
    }, 8000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="unauthorized-container">
      <div className="unauthorized-card">
        <h1>Access denied 🚫</h1>

        <p>
          You don’t have permission to access this page.
        </p>

        {profile?.role && (
          <p className="role-info">
            Your role: <strong>{profile.role.replace("_", " ")}</strong>
          </p>
        )}

        <div className="actions">
          <Link to="/dashboard" className="btn primary">
            Go to Dashboard
          </Link>

          <button
            className="btn secondary"
            onClick={() => navigate(-1)}
          >
            Go Back
          </button>
        </div>

        <small className="hint">
          You’ll be redirected automatically in a few seconds.
        </small>
      </div>
    </div>
  );
}