// src/auth/ResetPassword.jsx
import { useState } from "react";
import Input from "../components/Input";
import Button from "../components/Button";
import { API_BASE_URL } from "../config/api";

export default function ResetPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleReset = async (e) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    setMessage("");
    setError("");

    try {
      const res = await fetch(`${API_BASE_URL}/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await res.json();

      setMessage(
        data.message ||
          "If an account exists for this email, a password reset link has been sent."
      );
    } catch {
      setMessage(
        "If an account exists for this email, a password reset link has been sent."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <h2 className="text-2xl font-bold mb-3 text-center">
          Reset Password
        </h2>

        <p className="text-gray-600 mb-6 text-center">
          Enter your email address and we’ll send you a link to reset your password.
        </p>

        <form onSubmit={handleReset} className="space-y-4">
          <Input
            type="email"
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
          />

          {message && (
            <p className="text-green-600 text-sm text-center">
              {message}
            </p>
          )}

          {error && (
            <p className="text-red-600 text-sm text-center">
              {error}
            </p>
          )}

          <Button type="submit" disabled={loading || !email} className="w-full">
            {loading ? "Sending…" : "Send Reset Link"}
          </Button>
        </form>
      </div>
    </div>
  );
}
