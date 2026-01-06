// src/auth/VerifyEmailInfo.jsx
import { useState } from "react";
import { API_BASE_URL } from "../config/api";
import Button from "../components/Button";

export default function VerifyEmailInfo() {
  const [message, setMessage] = useState(
    "Your email is not verified. Please check your inbox for the verification link."
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleResend = async () => {
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const res = await fetch(`${API_BASE_URL}/auth/resend-verification`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // send cookies if needed
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to resend verification email.");
      } else {
        setMessage("Verification email sent! Please check your inbox.");
      }
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container max-w-md mx-auto p-6">
      <h2>Email Verification Required</h2>
      <p style={{ marginBottom: "1rem", color: "#555" }}>{message}</p>

      {error && <p style={{ color: "red", marginBottom: "1rem" }}>{error}</p>}

      <Button onClick={handleResend} disabled={loading}>
        {loading ? "Resending…" : "Resend Verification Email"}
      </Button>
    </div>
  );
}