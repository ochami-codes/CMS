// src/auth/ChangePassword.jsx
import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Input from "../../components/Input";
import Button from "../../components/Button";
import Loader from "../../components/Loader";
import EncouragementRedirect from "../../components/EncouragementRedirect";
import { isStrongPassword } from "../../utils/validators";
import { AuthAPI } from "../../utils/api";

export default function ChangePassword() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [passwordStrength, setPasswordStrength] = useState("");
  const [completed, setCompleted] = useState(false);

  /* ---------------- Password strength ---------------- */
  useEffect(() => {
    if (!newPassword) setPasswordStrength("");
    else if (isStrongPassword(newPassword))
      setPasswordStrength("Strong password ✅");
    else if (newPassword.length >= 6)
      setPasswordStrength("Weak: include letters and numbers ⚠️");
    else setPasswordStrength("Too short ⚠️");
  }, [newPassword]);

  /* ---------------- Submit ---------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!isStrongPassword(newPassword)) {
      setError(
        "Password must be at least 6 characters and include a letter and a number."
      );
      return;
    }

    setLoading(true);

    try {
      await AuthAPI.changePassword(newPassword);

      // ✅ Show encouragement first
      setCompleted(true);
    } catch (err) {
      setError(err.data?.message || err.message || "Failed to update password.");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- Success screen ---------------- */
  if (completed) {
    return (
      <EncouragementRedirect
        title="Password updated 🔐"
        message="Your password has been changed successfully. You’ll be redirected to sign in again."
        redirectTo="/login"
        delay={10000}
        onComplete={async () => {
          // ✅ Logout AFTER encouragement
          await logout();
        }}
      />
    );
  }

  if (loading) {
    return <Loader message="Updating password… God is faithful." />;
  }

  /* ---------------- Form ---------------- */
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50">
      <div className="w-full max-w-md card p-6 shadow-md">
        <h2 className="text-2xl font-bold mb-4 text-center">
          Change Password
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="New password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="At least 6 characters"
            required
          />

          {passwordStrength && (
            <p
              className={`text-sm ${
                passwordStrength.includes("Strong")
                  ? "text-green-600"
                  : "text-orange-500"
              }`}
            >
              {passwordStrength}
            </p>
          )}

          <Input
            label="Confirm new password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Repeat new password"
            required
          />

          {error && <p className="text-red-600 text-sm text-center">{error}</p>}

          <Button type="submit" disabled={loading} className="w-full">
            Update Password
          </Button>

          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate("/dashboard/profile")}
            className="w-full"
          >
            Cancel
          </Button>
        </form>
      </div>
    </div>
  );
}
