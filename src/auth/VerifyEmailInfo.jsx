// src/auth/VerifyEmailInfo.jsx
import { useState } from "react";
import { API_BASE_URL } from "../config/api";
import Button from "../components/Button";
import Input from "../components/Input";

export default function VerifyEmailInfo() {
  // 🔑 Get stored email (recommended)
  const storedEmail = localStorage.getItem("pending_verification_email");

  const [email, setEmail] = useState(storedEmail || "");
  const [message, setMessage] = useState(
    "Your email is not verified. Please check your inbox for the verification link."
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleResend = async () => {
    if (!email.trim()) {
      setError("Please enter a valid email.");
      return;
    }

    setLoading(true);
    setError("");
    setMessage("");

    try {
      const res = await fetch(`${API_BASE_URL}/auth/resend-verification`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to resend verification email.");
      } else {
        setMessage(data.message || "Verification email sent!");
        // 🔑 Save updated email to localStorage
        localStorage.setItem("pending_verification_email", email.trim());
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container max-w-md mx-auto p-6">
      <h2 className="text-xl font-bold mb-3">
        Email Verification Required
      </h2>

      <p className="text-gray-600 mb-4">{message}</p>

      <Input
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
        required
      />

      {error && <p className="text-red-600 mb-3">{error}</p>}

      <Button onClick={handleResend} disabled={loading || !email}>
        {loading ? "Resending…" : "Resend Verification Email"}
      </Button>
    </div>
  );
}
