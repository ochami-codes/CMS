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
    styles[variant],
    styles[size],
    fullWidth ? styles.full : "",
    isDisabled ? styles.disabled : "",
    className,
  ].join(" ");

  if (to) {
    return (
      <Link
        to={isDisabled ? "#" : to}
        className={classes}
        aria-disabled={isDisabled}
        onClick={
          isDisabled
            ? (e) => e.preventDefault()
            : props.onClick
        }
        {...props}
      >
        {loading && (
          <span
            className={styles.spinner}
            aria-hidden="true"
          />
        )}

        {children}
      </Link>
    );
  }

  return (
    <button
      className={classes}
      disabled={isDisabled}
      type={type}
      {...props}
    >
      {loading && (
        <span
          className={styles.spinner}
          aria-hidden="true"
        />
      )}

      {children}
    </button>
  );
}