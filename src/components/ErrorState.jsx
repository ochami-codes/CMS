import React from "react";
import styles from "../styles/components/ErrorState.module.css";

export default function ErrorState({
  title = "Something went wrong",
  message = "An unexpected error occurred.",
  onRetry,
}) {
  return (
    <div className={styles.errorState}>
      <h2 className={styles.title}>{title}</h2>

      {message && (
        <p className={styles.message}>
          {message}
        </p>
      )}

      {onRetry && (
        <button
          type="button"
          className={styles.retryButton}
          onClick={onRetry}
        >
          Retry
        </button>
      )}
    </div>
  );
}
