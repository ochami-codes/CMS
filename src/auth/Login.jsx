import { useState, useEffect } from "react";
import {
  useNavigate,
  useLocation,
  Link,
} from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import { AuthAPI } from "../utils/api";

import Input from "../components/Input";
import PasswordInput from "../components/PasswordInput";
import Button from "../components/Button";

import styles from "../styles/pages/Login.module.css";

export default function Login() {

  const navigate = useNavigate();
  const location = useLocation();

  const { user, login, authReady } = useAuth();

  const verified = location.state?.verified;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [submitting, setSubmitting] = useState(false);

  const [error, setError] = useState("");
  const [resendMessage, setResendMessage] = useState("");

  /* redirect after login */
  useEffect(() => {
    if (authReady && user) {
      const hasActiveChurch =
        user.memberships?.some(
          m => m.status === "active"
        );

      if (hasActiveChurch) {
        navigate("/dashboard", {
          replace: true
        });
      } else {
        navigate("/onboarding", {
          replace: true
        });
      }
    }
  }, [authReady, user, navigate]);

  /* submit login */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (submitting) return;

    setError("");
    setResendMessage("");
    setSubmitting(true);

    try {
      await login({ email, password });
    } catch (err) {
      setError(
        err?.message ||
        "Login failed. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  /* resend verification */
  const handleResendVerification = async () => {
    if (!email) {
      return setResendMessage(
        "Please enter your email first."
      );
    }

    try {
      await AuthAPI.resendVerification(email);

      setResendMessage(
        "Verification email sent. Check your inbox."
      );
    } catch {
      setResendMessage(
        "Failed to resend verification email."
      );
    }
  };

  return (
    <div className={styles.container}>

      <div className={styles.card}>

        <h2 className={styles.title}>
          Login
        </h2>

        {/* messages */}
        {verified && (
          <p className={`${styles.message} ${styles.success}`}>
            Registration successful! Please log in.
          </p>
        )}

        {error && (
          <p className={`${styles.message} ${styles.error}`}>
            {error}
          </p>
        )}

        {resendMessage && (
          <p className={`${styles.message} ${styles.info}`}>
            {resendMessage}
          </p>
        )}

        {/* form */}
        <form
          onSubmit={handleSubmit}
          className={styles.form}
        >

          <Input
            type="email"
            label="Email"
            name="email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            placeholder="you@example.com"
            required
          />

          <PasswordInput
            label="Password"
            name="password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            required
          />

          {error
            .toLowerCase()
            .includes("verify") && (
<Button
  type="button"
  className={`btn-primary w-full ${styles.resendBtn}`}
  onClick={handleResendVerification}
>
  Resend verification email
</Button>
          )}

          <Button
            type="submit"
            disabled={submitting}
            className="btn-primary w-full"
          >
            {submitting
              ? "Logging in…"
              : "Login"}
          </Button>

        </form>

        {/* forgot */}
        <div className={styles.forgot}>

          <Link
            to="/reset-password"
            className={styles.link}
          >
            Forgot password?
          </Link>

        </div>

      </div>

    </div>
  );
}
