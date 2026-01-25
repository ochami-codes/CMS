// src/auth/Login.jsx
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Input from "../components/Input";
import Button from "../components/Button";
import PasswordInput from "../components/PasswordInput";
import { AuthAPI } from "../utils/api";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const verified = location.state?.verified; // from registration redirect
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resendMessage, setResendMessage] = useState("");

  // ✅ Auto-redirect if user info exists in localStorage
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");

    if (token && storedUser) {
      const target =
        storedUser.role_name === "Admin"
          ? "/dashboard/admin"
          : "/dashboard";
      navigate(target, { replace: true });
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    setError("");
    setResendMessage("");
    setLoading(true);

    try {
      const data = await AuthAPI.login({ email, password });

      // Save auth data
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // Redirect based on role
      const target =
        data.user.role_name === "Admin"
          ? "/dashboard/admin"
          : "/dashboard";
      navigate(target, { replace: true });
    } catch (err) {
      console.error(err);
      if (err.status === 403 && err.message?.toLowerCase().includes("verify")) {
        setError(err.message || "Please verify your email.");
      } else {
        setError(err.message || "Login failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    setResendMessage("");
    if (!email) {
      setResendMessage("Please enter your email first.");
      return;
    }

    try {
      await AuthAPI.resendVerification(email);
      setResendMessage("Verification email sent. Check your inbox.");
    } catch (err) {
      console.error(err);
      setResendMessage(
        err.message || "Failed to resend verification email. Try again later."
      );
    }
  };

  return (
    <div className="max-w-md mx-auto pt-16">
      <h2 className="text-2xl font-bold mb-4">Login</h2>

      {/* Email verified message */}
      {verified && (
        <p className="text-green-600 mb-3">
          Registration successful! Please log in to continue.
        </p>
      )}

      {error && <p className="text-red-600 mb-3">{error}</p>}
      {resendMessage && <p className="text-green-600 mb-3">{resendMessage}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Email"
          type="email"
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

        {error && error.toLowerCase().includes("verify") && (
          <button
            type="button"
            onClick={handleResendVerification}
            className="text-sm text-blue-600"
          >
            Resend verification email
          </button>
        )}

        <Button type="submit" disabled={loading}>
          {loading ? "Logging in…" : "Login"}
        </Button>

        <div className="text-right mt-3">
          <button
            type="button"
            onClick={() => navigate("/reset-password")}
            className="text-sm text-blue-600"
          >
            Forgot password?
          </button>
        </div>
      </form>
    </div>
  );
}
