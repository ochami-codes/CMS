// src/auth/ResetPasswordConfirm.jsx
import { useState } from "react";
import Input from "../components/Input";
import Button from "../components/Button";
import { isStrongPassword } from "../utils/validators";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AuthAPI } from "../api/API";

export default function ResetPasswordConfirm() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // 🔒 Invalid / missing token guard
  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-md text-center">
          <p className="text-red-600">
            Invalid or expired password reset link.
          </p>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    setError("");
    setSuccess("");

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!isStrongPassword(newPassword)) {
      setError(
        "Password must be at least 6 characters and include both letters and numbers."
      );
      return;
    }

    setLoading(true);

    try {
      // ✅ Use centralized API
      await AuthAPI.resetPasswordConfirm({ token, newPassword });

      setSuccess("Password reset successful. Redirecting to login…");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      console.error(err);
      setError("Unable to reset password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <h2 className="text-2xl font-bold mb-3 text-center">
          Set New Password
        </h2>

        <p className="text-gray-600 mb-6 text-center">
          Choose a strong password for your account.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="password"
            label="New password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />

          <Input
            type="password"
            label="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          {error && (
            <p className="text-red-600 text-sm text-center">
              {error}
            </p>
          )}

          {success && (
            <p className="text-green-600 text-sm text-center">
              {success}
            </p>
          )}

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Updating…" : "Update Password"}
          </Button>
        </form>
      </div>
    </div>
  );
}
