import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Input from "../components/Input";
import Button from "../components/Button";
import { API_BASE_URL } from "../config/api";

const API_URL = API_BASE_URL;

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
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        // 403 → email not verified
        if (res.status === 403 && data.message?.includes("verify your email")) {
          setError(data.message);
          return;
        }
        setError(data.message || "Login failed");
        return;
      }

      // 1️⃣ Store JWT
      localStorage.setItem("token", data.token);

      // 2️⃣ Optional role-based redirect
      if (data.user.role_name === "Admin") {
        navigate("/dashboard/admin", { replace: true });
      } else {
        navigate(redirectTo, { replace: true });
      }
    } catch (err) {
      setError("Server unreachable. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Optional: resend verification email
  const handleResendVerification = async () => {
    setResendMessage("");
    try {
      const res = await fetch(`${API_URL}/auth/resend-verification`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) {
        setResendMessage(data.error || "Failed to resend email");
      } else {
        setResendMessage("Verification email sent. Check your inbox.");
      }
    } catch (err) {
      setResendMessage("Server error. Try again later.");
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "0 auto", paddingTop: "4rem" }}>
      <h2>Login</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          required
        />

        <Input
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="********"
          required
        />

        {error && (
          <p style={{ color: "red", marginTop: 4 }}>{error}</p>
        )}

        {error?.includes("verify your email") && (
          <button
            type="button"
            onClick={handleResendVerification}
            className="text-sm text-blue-600 mt-2"
          >
            Resend verification email
          </button>
        )}

        {resendMessage && (
          <p style={{ color: "green", marginTop: 4 }}>{resendMessage}</p>
        )}

        <Button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </Button>

        <div style={{ marginTop: 12, textAlign: "right" }}>
          <button
            type="button"
            onClick={() => navigate("/reset-password")}
            className="link-button"
          >
            Forgot password?
          </button>
        </div>
      </form>
    </div>
  );
}
