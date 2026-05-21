import { Link } from "react-router-dom";
import styles from "../styles/components/Button.module.css";

export default function Button({
  children,
  variant = "primary",
  to,
  className = "",
  ...props
}) {
  const classes =
    `${styles.btn}
     ${styles[variant]}
     ${className}`;

  // Navigation button
  if (to) {
    return (
      <Link
        to={to}
        className={classes}
        {...props}
      >
        {children}
      </Link>
    );
  }

  // Action button
  return (
    <button
      className={classes}
      {...props}
    >
      {children}
    </button>
  );
}
