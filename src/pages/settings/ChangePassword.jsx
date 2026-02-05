import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Input from "../../components/Input";
import Button from "../../components/Button";
import Loader from "../../components/Loader";
import { isStrongPassword } from "../../utils/validators";
import { API_BASE_URL } from "../../config/api";

export default function ChangePassword() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [passwordStrength, setPasswordStrength] = useState("");

  // Show password strength as user types
  useEffect(() => {
    if (!newPassword) setPasswordStrength("");
    else if (isStrongPassword(newPassword)) setPasswordStrength("Strong password ✅");
    else if (newPassword.length >= 6) setPasswordStrength("Weak: include letters and numbers ⚠️");
    else setPasswordStrength("Too short ⚠️");
  }, [newPassword]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!newPassword) {
      setError("Please enter a new password.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New password and confirmation do not match.");
      return;
    }

    if (!isStrongPassword(newPassword)) {
      setError("Password must be at least 6 characters and include a number and a letter.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/auth/change-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ newPassword }),
      });

      const data = await res.json();

      if (!res.ok) setError(data.message || "Failed to update password.");
      else {
        setSuccess(data.message || "Password updated successfully.");

        if (data.logout) {
          await logout();
          navigate("/login", { replace: true });
        }
      }
    } catch (err) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  if (loading && !success) {
    // Optional: show full-page loader while the request is processing
    return <Loader message="God loves you..." />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50">
      <div className="w-full max-w-md card p-6 shadow-md">
        <h2 className="text-2xl font-bold mb-4 text-center">Change Password</h2>
        <p className="text-gray-600 mb-6 text-center">
          Change your account password. You will be signed out after a successful change.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Current password (optional)"
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="Current password"
          />

          <Input
            label="New password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="At least 6 characters, include a number"
            required
          />
          {passwordStrength && (
            <p
              className={`text-sm mt-1 ${
                passwordStrength.includes("Strong") ? "text-green-600" : "text-orange-500"
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
          {success && <p className="text-green-600 text-sm text-center">{success}</p>}

          <div className="flex flex-col sm:flex-row sm:justify-between gap-3 mt-2">
            <Button type="submit" disabled={loading} className="w-full sm:w-auto">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="animate-spin h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    ></path>
                  </svg>
                  Updating...
                </span>
              ) : (
                "Update Password"
              )}
            </Button>

            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate("/dashboard/profile")}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
