// src/auth/Login.jsx
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Input from "../components/Input";
import Button from "../components/Button";
import PasswordInput from "../components/PasswordInput"; // ✅ reuse
import { API_BASE_URL } from "../config/api";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resendMessage, setResendMessage] = useState("");

  const redirectTo = location.state?.from || "/dashboard";

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    setError("");
    setResendMessage("");
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        // Email not verified
        if (res.status === 403) {
          setError(data.details || data.error || "Please verify your email.");
          return;
        }

        setError(data.details || data.error || "Login failed");
        return;
      }

      // ✅ Store auth data
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // ✅ Role-based redirect
      if (data.user.role_name === "Admin") {
        navigate("/dashboard/admin", { replace: true });
      } else {
        navigate(redirectTo, { replace: true });
      }
    } catch (err) {
      console.error(err);
      setError("Server unreachable. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Resend verification email
  const handleResendVerification = async () => {
    setResendMessage("");

    try {
      const res = await fetch(`${API_BASE_URL}/auth/resend-verification`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setResendMessage(
          data.details || data.error || "Failed to resend email"
        );
      } else {
        setResendMessage("Verification email sent. Check your inbox.");
      }
    } catch {
      setResendMessage("Server error. Try again later.");
    }
  };

  return (
    <div className="max-w-md mx-auto pt-16">
      <h2 className="text-2xl font-bold mb-4">Login</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          required
        />

        {/* Password with eye toggle */}
        <PasswordInput
          label="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {error && <p className="text-red-600">{error}</p>}

        {error && error.toLowerCase().includes("verify") && (
          <button
            type="button"
            onClick={handleResendVerification}
            className="text-sm text-blue-600"
          >
            Resend verification email
          </button>
        )}

        {resendMessage && (
          <p className="text-green-600">{resendMessage}</p>
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
