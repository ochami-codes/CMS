// src/auth/Login.jsx
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

  const redirectTo = location.state?.from || "/dashboard";

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // IMPORTANT if using cookies
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Login failed");
        return;
      }

      /**
       * Option A: backend uses httpOnly cookies (BEST)
       * → nothing to store here
       */

      /**
       * Option B: backend returns token
       * localStorage.setItem("token", data.token);
       */

      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError("Server unreachable. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "0 auto", paddingTop: "4rem" }}>
      <h2>Login</h2>

      <form onSubmit={handleSubmit}>
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
          <p style={{ color: "red", marginTop: 8 }}>{error}</p>
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