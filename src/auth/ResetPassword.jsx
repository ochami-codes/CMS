import { useState } from "react";

import Input from "../components/Input";
import Button from "../components/Button";
import Loader from "../components/Loader";
import EncouragementRedirect from "../components/EncouragementRedirect";

import { AuthAPI } from "../utils/api";

import styles from "../styles/pages/ResetPassword.module.css";

export default function ResetPassword() {

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleReset = async (e) => {
    e.preventDefault();

    if (loading) return;

    setLoading(true);
    setError("");

    try {
      await AuthAPI.resetPassword(email.trim());

      // always show success screen (anti-enumeration)
      setSubmitted(true);

    } catch (err) {
      console.error("Reset password error:", err);

      // same UX regardless of failure
      setSubmitted(true);

    } finally {
      setLoading(false);
    }
  };

  /* ---------------- SUCCESS SCREEN ---------------- */
  if (submitted) {
    return (
      <EncouragementRedirect
        title="Check your email 📩"
        message="If an account exists for this email, a password reset link has been sent. Please open the link in your email to continue."
        redirectTo="/login"
        delay={10000}
      />
    );
  }

  /* ---------------- LOADING SCREEN ---------------- */
  if (loading) {
    return (
      <Loader message="Sending reset link… God loves you..." />
    );
  }

  return (
    <div className={styles.container}>

      <div className={styles.card}>

        <h2 className={styles.title}>
          Reset Password
        </h2>

        <p className={styles.description}>
          Enter your email address and we’ll send you a link to reset your password.
        </p>

        <form
          onSubmit={handleReset}
          className={styles.form}
        >

          <Input
            type="email"
            label="Email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            placeholder="you@example.com"
            required
          />

          {error && (
            <p className={styles.error}>
              {error}
            </p>
          )}

          <Button
            type="submit"
            disabled={!email || loading}
            className="btn-primary w-full"
          >
            {loading
              ? "Sending…"
              : "Send Reset Link"}
          </Button>

        </form>

      </div>

    </div>
  );
}
