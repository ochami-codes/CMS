// src/pages/Login.jsx
import { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import PasswordInput from "../components/PasswordInput";
import Input from "../components/Input";
import Button from "../components/Button";
import Loader from "../components/Loader";
import { AuthAPI } from "../utils/api";
import "../styles/auth.css";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const { user, login, authReady } = useAuth();
  const verified = location.state?.verified;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [resendMessage, setResendMessage] = useState("");

  /* --------------------------------------------------
     Redirect once authenticated
  -------------------------------------------------- */
  useEffect(() => {
  if (authReady && user) {
    navigate("/dashboard", { replace: true });
  }
}, [authReady, user, navigate]);

  /* --------------------------------------------------
     Submit login
  -------------------------------------------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;

    setError("");
    setResendMessage("");
    setSubmitting(true);

    try {
      await login({ email, password });
    } catch (err) {
      console.error(err);
      setError(err?.message || "Login failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  /* --------------------------------------------------
     Resend verification
  -------------------------------------------------- */
  const handleResendVerification = async () => {
    if (!email) return setResendMessage("Please enter your email first.");

    try {
      await AuthAPI.resendVerification(email);
      setResendMessage("Verification email sent. Check your inbox.");
    } catch {
      setResendMessage("Failed to resend verification email.");
    }
  };

  /* --------------------------------------------------
     UI
  -------------------------------------------------- */
  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Login</h2>

        {/* Verification / Error Messages */}
        {verified && (
          <p className="text-green-600 text-center text-sm">
            Registration successful! Please log in.
          </p>
        )}
        {error && (
          <p className="text-red-600 text-center text-sm">{error}</p>
        )}
        {resendMessage && (
          <p className="text-blue-600 text-center text-sm">{resendMessage}</p>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit}>
          <Input
            type="email"
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
          />

          <PasswordInput
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error.toLowerCase().includes("verify") && (
            <Button
              type="button"
              className="btn-primary w-full"
              onClick={handleResendVerification}
            >
              Resend verification email
            </Button>
          )}

          <Button type="submit" disabled={submitting} className="btn-primary w-full">
            {submitting ? "Logging in…" : "Login"}
          </Button>
        </form>

        {/* Forgot Password */}
        <div className="text-center mt-2">
          <Link
            to="/reset-password"
            className="text-blue-600 hover:underline text-sm"
          >
            Forgot password?
          </Link>
        </div>
      </div>
    </div>
  );
}
