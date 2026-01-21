// src/auth/VerifyEmailInfo.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthAPI } from "../utils/api";
import Button from "../components/Button";

export default function VerifyEmail() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const email = localStorage.getItem("pending_verification_email") || "";

  const handleResend = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await AuthAPI.resendVerification({ email });
      if (res.message) setMessage(res.message);
    } catch (err) {
      console.error(err);
      setError("Failed to resend verification email. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <h2 className="text-2xl font-bold mb-4 text-center">Verify Your Email</h2>

      {message && <p className="text-green-600 text-center mb-3">{message}</p>}
      {error && <p className="text-red-600 text-center mb-3">{error}</p>}

      <p className="text-gray-700 text-center mb-4">
        We sent a verification email to <strong>{email}</strong>. Please check your inbox.
      </p>

      <Button onClick={handleResend} disabled={loading}>
        {loading ? "Sending…" : "Resend Verification Email"}
      </Button>

      <Button onClick={() => navigate("/login")} className="mt-2" variant="secondary">
        Back to Login
      </Button>
    </div>
  );
}
