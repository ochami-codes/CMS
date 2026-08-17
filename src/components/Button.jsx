import { Link } from "react-router-dom";

import styles from "../styles/components/Button.module.css";

export default function Button({
  children,
  variant = "primary",
  size = "md",
  type = "button",
  to,
  fullWidth = false,
  disabled = false,
  loading = false,
  className = "",
  ...props
}) {
  const isDisabled = disabled || loading;

  const classes = [
    styles.btn,
    styles[variant] || styles.primary,
    styles[size] || styles.md,
    fullWidth ? styles.full : "",
    isDisabled ? styles.disabled : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const content = (
    <>
      {loading && (
        <span
          className={styles.spinner}
          aria-hidden="true"
        />
      )}

      <span className={loading ? styles.loadingText : ""}>
        {children}
      </span>
    </>
  );

  /* -------------------------
     Link button
  ------------------------- */

  if (to) {
    return (
      <Link
        to={isDisabled ? "#" : to}
        className={classes}
        aria-disabled={isDisabled}
        tabIndex={isDisabled ? -1 : undefined}
        onClick={
          isDisabled
            ? (e) => e.preventDefault()
            : props.onClick
        }
        {...props}
      >
        {content}
      </Link>
    );
  }

  /* -------------------------
     Native button
  ------------------------- */

  return (
    <button
      className={classes}
      type={type}
      disabled={isDisabled}
      aria-busy={loading}
      {...props}
    >
      {content}
    </button>
  );
}