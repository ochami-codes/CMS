import { useState } from "react";
import Input from "../components/Input";
import Button from "../components/Button";
import { API_BASE_URL } from "../config/api";

export default function ResetPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleReset = async (e) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    setMessage("");

    try {
      await fetch(`${API_BASE_URL}/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      // ALWAYS show success message (even if email doesn't exist)
      setMessage(
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
    <div className="auth-container">
      <h2>Reset Password</h2>

      <form onSubmit={handleReset}>
        <Input
          type="email"
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        {message && <p className="success">{message}</p>}

        <Button type="submit" disabled={loading || !email}>
          {loading ? "Sending..." : "Send Reset Link"}
        </Button>
      </form>
    </div>
  );
}