// src/auth/ChangePassword.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../../components/Input";
import Button from "../../components/Button";
import Loader from "../../components/Loader";
import { isStrongPassword } from "../../utils/validators";
import { AuthAPI } from "../../utils/api";
import styles from "../../styles/profiles/ChangePassword.module.css";

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
    <main className={styles.page}>
      <section className={styles.card}>
        <h1 className={styles.title}>Change Password</h1>

        <form onSubmit={handleSubmit} className={styles.form}>
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
              className={`${styles.helper} ${
                passwordStrength.includes("Strong")
                  ? styles.success
                  : styles.warning
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

          {error && <p className={styles.error}>{error}</p>}

          <div className={styles.actions}>
            <Button type="submit" className={styles.button}>
              Update Password
            </Button>

            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate("/dashboard/profiles")}
              className={styles.button}
            >
              Cancel
            </Button>
          </div>
        </form>
      </section>
    </main>
  );
}

