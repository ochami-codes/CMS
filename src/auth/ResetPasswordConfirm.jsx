import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import { supabase } from "../supabaseClient";
import { isStrongPassword } from "../utils/validators/validators";

import { useUpdatePassword } from "../hooks/auth/useUpdatePassword";

import Input from "../components/Input";
import Button from "../components/Button";
import Loader from "../components/Loader";

import styles from "../styles/pages/ResetPasswordConfirm.module.css";

export default function ResetPasswordConfirm() {
  const navigate = useNavigate();

  const [sessionReady, setSessionReady] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const [error, setError] = useState("");

  const {
    mutate: updatePassword,
    isPending,
  } = useUpdatePassword();

  /* ------------------ session setup ------------------ */

  useEffect(() => {
    let mounted = true;

    const initializeRecoverySession = async () => {
      try {
        /*
         * Supabase may have placed the recovery tokens
         * in the URL hash.
         */
        const hash = window.location.hash.substring(1);
        const params = new URLSearchParams(hash);

        const accessToken = params.get("access_token");
        const refreshToken = params.get("refresh_token");
        const type = params.get("type");

        /*
         * If Supabase gave us recovery tokens, establish
         * the session explicitly.
         */
        if (
          type === "recovery" &&
          accessToken &&
          refreshToken
        ) {
          const { error: sessionError } =
            await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken,
            });

          if (!mounted) return;

          if (sessionError) {
            console.error(
              "Recovery session error:",
              sessionError
            );

            setError(
              "Invalid or expired password reset link."
            );

            setCheckingSession(false);
            return;
          }

          setSessionReady(true);
          setCheckingSession(false);

          return;
        }

        /*
         * The Supabase client may already have processed
         * the recovery session.
         */
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!mounted) return;

        if (session) {
          setSessionReady(true);
        } else {
          setError(
            "Invalid or expired password reset link."
          );
        }

        setCheckingSession(false);
      } catch (err) {
        console.error(
          "Password recovery initialization error:",
          err
        );

        if (!mounted) return;

        setError(
          "Invalid or expired password reset link."
        );

        setCheckingSession(false);
      }
    };

    initializeRecoverySession();

    /*
     * Also listen for Supabase's recovery event.
     */
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (!mounted) return;

        if (
          event === "PASSWORD_RECOVERY" &&
          session
        ) {
          setSessionReady(true);
          setCheckingSession(false);
          setError("");
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  /* ------------------ submit ------------------ */

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isPending) return;

    setError("");

    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    if (!isStrongPassword(password)) {
      setError(
        "Password must be at least 6 characters and include letters and numbers."
      );
      return;
    }

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

  /* ------------------ checking ------------------ */

  if (checkingSession) {
    return (
      <Loader
        message="Verifying reset link… God loves you!"
        fullScreen={false}
      />
    );
  }

  /* ------------------ invalid link ------------------ */

  if (error && !sessionReady) {
    return (
      <div className={styles.container}>
        <div className={styles.card}>
          <p className={styles.error}>{error}</p>

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
            <p className={styles.error}>{error}</p>
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