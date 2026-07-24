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

  const {
    user,
    login,
    authReady,
    authLoading,
  } = useAuth();

  const verified =
    location.state?.verified;

  const [email, setEmail] = useState("");
  const [password, setPassword] =
    useState("");

  const [error, setError] =
    useState("");

  const [resendMessage, setResendMessage] =
    useState("");

  const [submitting, setSubmitting] =
    useState(false);

  /* -------------------------
     Combined Loading State
  ------------------------- */

  const loading =
    authLoading || submitting;

  /* -------------------------
     Redirect After Login
  ------------------------- */

  useEffect(() => {
    if (!authReady || !user) {
      return;
    }

    const hasActiveChurch =
      user.churches?.some(
        (church) =>
          church.status === "active"
      );

    if (hasActiveChurch) {
      navigate("/dashboard", {
        replace: true,
      });
    } else {
      navigate("/onboarding", {
        replace: true,
      });
    }
  }, [
    authReady,
    user,
    navigate,
  ]);

  /* -------------------------
     Submit Login
  ------------------------- */

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) {
      return;
    }

    setError("");
    setResendMessage("");
    setSubmitting(true);

    try {
      await login({
        email,
        password,
      });
    } catch (err) {
      setError(
        err?.message ||
          "Login failed. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  /* -------------------------
     Resend Verification
  ------------------------- */

  const handleResendVerification =
    async () => {
      if (loading) {
        return;
      }

      if (!email) {
        setResendMessage(
          "Please enter your email first."
        );

        return;
      }

      setResendMessage("");
      setSubmitting(true);

      try {
        await AuthAPI.resendVerification(
          email
        );

        setResendMessage(
          "Verification email sent. Check your inbox."
        );
      } catch {
        setResendMessage(
          "Failed to resend verification email."
        );
      } finally {
        setSubmitting(false);
      }
    };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.title}>
          Login
        </h2>

        {/* -------------------------
            Messages
        ------------------------- */}

        {verified && (
          <p
            className={`${styles.message} ${styles.success}`}
          >
            Registration successful! Please log in.
          </p>
        )}

        {error && (
          <p
            className={`${styles.message} ${styles.error}`}
          >
            {error}
          </p>
        )}

        {resendMessage && (
          <p
            className={`${styles.message} ${styles.info}`}
          >
            {resendMessage}
          </p>
        )}

        {/* -------------------------
            Form
        ------------------------- */}

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
            disabled={loading}
          />

          <PasswordInput
            label="Password"
            name="password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            required
            disabled={loading}
          />

          {error
            .toLowerCase()
            .includes("verify") && (
            <Button
              type="button"
              className={`btn-primary w-full ${styles.resendBtn}`}
              onClick={
                handleResendVerification
              }
              loading={loading}
              disabled={loading}
            >
              {loading
                ? "Sending…"
                : "Resend verification email"}
            </Button>
          )}

          <Button
            type="submit"
            loading={loading}
            disabled={loading}
            className="btn-primary w-full"
          >
            {loading
              ? "Logging in…"
              : "Login"}
          </Button>
        </form>

        {/* -------------------------
            Forgot Password
        ------------------------- */}

        <div
          className={styles.forgot}
        >
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

