// src/auth/ResetPassword.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../components/Input";
import Button from "../components/Button";
import Loader from "../components/Loader";
import { AuthAPI } from "../utils/api";

export default function ResetPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleReset = async (e) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    setError("");

    try {
      await AuthAPI.resetPassword(email.trim());

      // Save the email locally for verification page
      localStorage.setItem("pending_verification_email", email.trim());

      navigate("/verify-pending");
    } catch (err) {
      console.error("Reset password error:", err);
      // Anti-enumeration: always show same message
      setError(
        "If an account exists for this email, a password reset link has been sent."
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader message="Sending reset link… God loves you..." />;

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50">
      <div className="w-full max-w-md card p-6 shadow-md">
        <h2 className="text-2xl font-bold mb-4 text-center">Reset Password</h2>

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

          {error && (
            <p className="text-red-600 text-sm text-center">{error}</p>
          )}

          <Button
            type="submit"
            disabled={loading || !email}
            className="w-full"
          >
            {loading ? "Sending…" : "Send Reset Link"}
          </Button>
        </form>
      </div>
    </div>
  );
}
