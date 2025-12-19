// src/auth/ResetPassword.jsx
import { useState } from "react";
import { supabase } from "../supabaseClient";
import Input from "../components/Input";
import Button from "../components/Button";

export default function ResetPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleReset = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password-confirm`,
    });

    if (error) {
      setError(error.message);
    } else {
      setMessage("Check your email for password reset instructions.");
    }

    setLoading(false);
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

        {error && <p className="error">{error}</p>}
        {message && <p className="success">{message}</p>}

        <Button type="submit" disabled={loading}>
          {loading ? "Sending..." : "Send Reset Link"}
        </Button>
      </form>
    </div>
  );
}