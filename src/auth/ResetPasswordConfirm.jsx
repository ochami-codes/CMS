import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import { supabase } from "../supabaseClient";
import { isStrongPassword } from "../utils/validators";

import { useUpdatePassword } from "../hooks/auth/useUpdatePassword";

import Input from "../components/Input";
import Button from "../components/Button";
import Loader from "../components/Loader";

import styles from "../styles/pages/ResetPasswordConfirm.module.css";

export default function ResetPasswordConfirm() {
  const navigate = useNavigate();

  const [sessionReady, setSessionReady] = useState(false);

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const [error, setError] = useState("");

  const {
    mutate: updatePassword,
    isPending,
  } = useUpdatePassword();

  /* ------------------ session setup ------------------ */

  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    const params = new URLSearchParams(hash);

    const access_token = params.get("access_token");
    const refresh_token = params.get("refresh_token");

    if (!access_token || !refresh_token) {
      setError("Invalid or expired password reset link.");
      return;
    }

    supabase.auth
      .setSession({
        access_token,
        refresh_token,
      })
      .then(({ error }) => {
        if (error) {
          setError("Invalid or expired password reset link.");
          return;
        }

        setSessionReady(true);
      });
  }, []);

  /* ------------------ submit ------------------ */

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isPending) return;

    setError("");

    /* Password confirmation */
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    /* Password strength */
    if (!isStrongPassword(password)) {
      setError(
        "Password must be at least 6 characters and include letters and numbers."
      );
      return;
    }

    /* Update password */
    updatePassword(password, {
      onSuccess: async () => {
        await supabase.auth.signOut();

        navigate("/login", {
          replace: true,
        });
      },

      onError: (err) => {
        setError(
          err?.message ||
            "Unable to update your password. Please try again."
        );
      },
    });
  };

  /* ------------------ invalid link ------------------ */

  if (error && !sessionReady) {
    return (
      <div className={styles.container}>
        <div className={styles.card}>
          <p className={styles.error}>
            {error}
          </p>

          <Link
            to="/login"
            className={styles.link}
          >
            Back to Login
          </Link>
        </div>
      </div>
    );
  }

  /* ------------------ loading ------------------ */

  if (!sessionReady) {
    return (
      <Loader message="Verifying reset link… God loves you!" fullScreen={false} />
    );
  }

  /* ------------------ form ------------------ */

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.title}>
          Set New Password
        </h2>

        <p className={styles.subtitle}>
          Choose a strong password for your account.
        </p>

        <form
          onSubmit={handleSubmit}
          className={styles.form}
        >
          <Input
            type="password"
            label="New password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            required
          />

          <Input
            type="password"
            label="Confirm password"
            value={confirm}
            onChange={(e) =>
              setConfirm(e.target.value)
            }
            required
          />

          {error && (
            <p className={styles.error}>
              {error}
            </p>
          )}

          <Button
            type="submit"
            loading={isPending}
            className="btn-primary w-full"
          >
            {isPending
              ? "Updating…"
              : "Update Password"}
          </Button>
        </form>

        <div className={styles.footer}>
          <Link
            to="/login"
            className={styles.link}
          >
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
