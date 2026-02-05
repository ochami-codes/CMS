// src/pages/Login.jsx
import { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Input from "../components/Input";
import Button from "../components/Button";
import Loader from "../components/Loader";
import { AuthAPI } from "../utils/api";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const { user, login, loading: authLoading } = useAuth();

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
    if (user) {
      navigate("/dashboard", { replace: true });
    }
  }, [user, navigate]);

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
      // AuthContext handles redirect
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
    if (!email) {
      setResendMessage("Please enter your email first.");
      return;
    }

    try {
      await AuthAPI.resendVerification(email);
      setResendMessage("Verification email sent. Check your inbox.");
    } catch {
      setResendMessage("Failed to resend verification email.");
    }
  };

  /* --------------------------------------------------
     Global auth loader
  -------------------------------------------------- */
  if (authLoading) {
    return <Loader message="Checking session… God loves you!" />;
  }

  /* --------------------------------------------------
     UI
  -------------------------------------------------- */
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50">
      <div className="w-full max-w-md card p-6 shadow-md">
        <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>

        {verified && (
          <p className="text-green-600 text-sm text-center mb-3">
            Registration successful! Please log in.
          </p>
        )}

        {error && (
          <p className="text-red-600 text-sm text-center mb-3">{error}</p>
        )}

        {resendMessage && (
          <p className="text-blue-600 text-sm text-center mb-3">
            {resendMessage}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="email"
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
          />

          <Input
            type="password"
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error.toLowerCase().includes("verify") && (
            <Button
              type="button"
              className="w-full"
              onClick={handleResendVerification}
            >
              Resend verification email
            </Button>
          )}

          <Button
            type="submit"
            disabled={submitting}
            className="w-full"
          >
            {submitting ? "Logging in…" : "Login"}
          </Button>
        </form>

        <div className="mt-4 text-center">
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
