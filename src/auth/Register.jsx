// src/auth/Register.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../components/Input";
import Button from "../components/Button";
import { API_BASE_URL } from "../config/api";
const API_URL = API_BASE_URL;

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    if (loading) return;

    setError("");
    setSuccess("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Registration failed");
        return;
      }

      /**
       * Backend decides:
       * - email confirmation ON → return message
       * - email confirmation OFF → auto-login (optional)
       */

      if (data.requiresEmailConfirmation) {
        setSuccess(
          "Registration successful! Please check your email to confirm your account."
        );
        return;
      }

      // Optional auto-login flow
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError("Server unreachable. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container relative max-w-md mx-auto p-6">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/70 z-10">
          <p className="text-sm">Creating your account…</p>
        </div>
      )}

      <h2 className="text-2xl font-bold mb-4">Register</h2>

      <form onSubmit={handleRegister} className="space-y-4">
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
          placeholder="********"
          required
        />

        <Input
          type="password"
          label="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="********"
          required
        />

        {error && <p className="text-red-600">{error}</p>}
        {success && <p className="text-green-600">{success}</p>}

        <Button type="submit" disabled={loading}>
          {loading ? "Please wait…" : "Register"}
        </Button>
      </form>

      <div className="mt-4 flex justify-between">
        <Button
          type="button"
          onClick={() => navigate("/login")}
          style={{ background: "#555" }}
        >
          Back to Login
        </Button>
      </div>
    </div>
  );
}