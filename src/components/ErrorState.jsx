import React from "react";
import { useNavigate } from "react-router-dom";

import Button from "./Button";
import styles from "../styles/components/ErrorState.module.css";

export default function ErrorState({
  title = "Something went wrong",
  message = "An unexpected error occurred.",
  error,
  onRetry,
}) {
  const navigate = useNavigate();

  const isSessionExpired =
    error?.code === "UNAUTHORIZED" ||
    error?.status === 401;

  const handleLogin = () => {
    navigate("/login", {
      replace: true,
    });
  };

  return (
    <div className={styles.errorState}>
      <h2 className={styles.title}>
        {isSessionExpired
          ? "Session expired"
          : title}
      </h2>

      <p className={styles.message}>
        {isSessionExpired
          ? "Your session has expired. Please log in again to continue."
          : message}
      </p>

      {isSessionExpired ? (
        <Button
          type="button"
          variant="primary"
          onClick={handleLogin}
        >
          Login
        </Button>
      ) : (
        onRetry && (
          <Button
            type="button"
            variant="primary"
            onClick={onRetry}
          >
            Retry
          </Button>
        )
      )}
    </div>
  );
}