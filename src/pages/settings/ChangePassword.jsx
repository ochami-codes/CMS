// src/auth/ChangePassword.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../../components/Input";
import Button from "../../components/Button";
import Loader from "../../components/Loader";
import { isStrongPassword } from "../../utils/validators";

import { AuthAPI } from "../../utils/api";

export default function ChangePassword() {
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [passwordStrength, setPasswordStrength] = useState("");

  /* ---------------- Password Strength ---------------- */
  useEffect(() => {
    if (!newPassword) {
      setPasswordStrength("");
    } else if (isStrongPassword(newPassword)) {
      setPasswordStrength("Strong password ✅");
    } else if (newPassword.length >= 6) {
      setPasswordStrength("Weak: include letters and numbers ⚠️");
    } else {
      setPasswordStrength("Too short ⚠️");
    }
  }, [newPassword]);

  /* ---------------- Handle Submit ---------------- */
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
      navigate("/profile/change-password-success");
    } catch (err) {
      setError(err.data?.message || err.message || "Failed to update password.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader message="Updating password… God is faithful." />;

  return (
    <main className="page-container">
      <section className="page-card">
        <h1 className="page-title text-center">Change Password</h1>

        <form onSubmit={handleSubmit} className="form-stack">
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
              className={`form-helper ${
                passwordStrength.includes("Strong")
                  ? "text-success"
                  : "text-warning"
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

          {error && <p className="form-error text-center">{error}</p>}

          <Button type="submit" className="w-full">
            Update Password
          </Button>

          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate("/dashboard/profiles")}
            className="w-full"
          >
            Cancel
          </Button>
        </form>
      </section>
    </main>
  );
}
