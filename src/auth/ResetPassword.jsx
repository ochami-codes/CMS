import { useState } from "react";
import Input from "../components/Input";
import Button from "../components/Button";
import Loader from "../components/Loader";
import EncouragementRedirect from "../components/EncouragementRedirect";
import { useResetPassword } from "../hooks/auth/useResetPassword";
import styles from "../styles/pages/ResetPassword.module.css";

export default function ResetPassword() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const { mutate: resetPassword, isPending } = useResetPassword();

  const handleReset = (e) => {
    e.preventDefault();

    if (isPending || !email.trim()) return;

    resetPassword(email, {
      onSettled: () => setSubmitted(true),
    });
  };

  // Success screen
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

  // Loading screen
  if (isPending) {
    return <Loader message="Sending reset link… God loves you..." />;
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.title}>Reset Password</h2>
        <p className={styles.description}>
          Enter your email address and we’ll send you a link to reset your password.
        </p>

        <form onSubmit={handleReset} className={styles.form}>
          <Input
            type="email"
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
          />

          <Button
            type="submit"
            loading={isPending}
            className="btn-primary w-full"
          >
            {isPending ? "Sending…" : "Send Reset Link"}
          </Button>
        </form>
      </div>
    </div>
  );
}

