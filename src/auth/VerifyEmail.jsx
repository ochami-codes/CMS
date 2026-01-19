// src/auth/VerifyEmail.jsx
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { API_BASE_URL } from "../config/api";

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setError("Invalid or missing verification token.");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`${API_BASE_URL}/auth/verify-email`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });

        const data = await res.json();

        if (!res.ok) {
          setError(data.message || "Verification failed.");
        } else {
          setMessage("Your email has been verified successfully.");
          localStorage.removeItem("pending_verification_email");

          // Redirect after short delay
          setTimeout(() => navigate("/login"), 2500);
        }
      } catch {
        setError("Server error. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    verifyEmail();
  }, [token, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md text-center">
        <h2 className="text-2xl font-bold mb-4">Email Verification</h2>

        {loading && (
          <p className="text-gray-600">Verifying your email…</p>
        )}

        {message && (
          <p className="text-green-600 text-center">{message}</p>
        )}

        {error && (
          <p className="text-red-600 text-center">{error}</p>
        )}
      </div>
    </div>
  );
}
