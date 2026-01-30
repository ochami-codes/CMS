import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, login, loading: authLoading } = useAuth();

  const verified = location.state?.verified;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resendMessage, setResendMessage] = useState("");

  /* ---------------- Auto redirect if already logged in ---------------- */
  useEffect(() => {
    if (user) {
      navigate("/dashboard", { replace: true });
    }
  }, [user, navigate]);

  /* ---------------- Submit ---------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    setError("");
    setResendMessage("");
    setLoading(true);

    try {
      await login({ email, password });
      navigate("/dashboard", { replace: true });
    } catch (err) {
      console.error(err);
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- Resend verification ---------------- */
  const handleResendVerification = async () => {
    if (!email) {
      setResendMessage("Please enter your email first.");
      return;
    }

    try {
      await AuthAPI.resendVerification(email);
      setResendMessage("Verification email sent. Check your inbox.");
    } catch (err) {
      setResendMessage("Failed to resend verification email.");
    }
  };

  if (authLoading) {
    return <div className="loader" />;
  }

  return (
    <div className="container" style={{ maxWidth: "420px", marginTop: "4rem" }}>
      <div className="card">
        <h2 style={{ marginBottom: "1rem" }}>Login</h2>

        {verified && (
          <p style={{ color: "#16a34a", marginBottom: "0.75rem" }}>
            Registration successful! Please log in.
          </p>
        )}

        {error && (
          <p style={{ color: "#dc2626", marginBottom: "0.75rem" }}>
            {error}
          </p>
        )}

        {resendMessage && (
          <p style={{ color: "#2563eb", marginBottom: "0.75rem" }}>
            {resendMessage}
          </p>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error.toLowerCase().includes("verify") && (
            <button
              type="button"
              className="btn btn-secondary"
              style={{ marginBottom: "0.75rem" }}
              onClick={handleResendVerification}
            >
              Resend verification email
            </button>
          )}

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: "100%" }}
            disabled={loading}
          >
            {loading ? "Logging in…" : "Login"}
          </button>
        </form>

        <div style={{ marginTop: "1rem", textAlign: "right" }}>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate("/reset-password")}
          >
            Forgot password?
          </button>
        </div>
      </div>
    </div>
  );
}
