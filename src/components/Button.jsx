import { Link } from "react-router-dom";
import styles from "../styles/components/Button.module.css";

export default function Button({
  children,
  variant = "primary",
  size = "md",
  to,
  fullWidth = false,
  disabled = false,
  className = "",
  ...props
}) {

  const classes = [
    styles.btn,
    styles[variant],
    styles[size],
    fullWidth ? styles.full : "",
    disabled ? styles.disabled : "",
    className,
  ].join(" ");

  if (to) {
    return (
      <Link
        to={disabled ? "#" : to}
        className={classes}
        {...props}
      >
        {children}
      </Link>
    );
  }

  return (
    <button
      className={classes}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
