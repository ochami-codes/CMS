import React from "react";
import { ErrorBoundary } from "react-error-boundary";
import styles from "../styles/components/ErrorBoundary.module.css";

function ErrorFallback() {
  return (
    <div className={styles.errorBoundary}>
      <div className={styles.content}>
        <div className={styles.icon}>!</div>

        <h1 className={styles.title}>Something went wrong</h1>

        <p className={styles.message}>
          An unexpected error occurred while loading this page. Please try again.
        </p>

        <button
          type="button"
          className={styles.reloadButton}
          onClick={() => window.location.reload()}
        >
          Reload Page
        </button>
      </div>
    </div>
  );
}

export default function AppErrorBoundary({ children }) {
  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onError={(error, errorInfo) => {
        console.error("React Error Boundary:", error, errorInfo);
      }}
    >
      {children}
    </ErrorBoundary>
  );
}
