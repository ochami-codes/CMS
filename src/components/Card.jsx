import styles from "../styles/components/Card.module.css";

export default function Card({
  children,
  title,
  action,
  className = "",
  onClick,
}) {
  return (
    <div
      className={`${styles.card} ${className}`}
      onClick={onClick}
      role={onClick ? "button" : undefined}
    >
      {title && (
        <div className={styles.header}>
          <h3 className={styles.title}>
            {title}
          </h3>

          {action}
        </div>
      )}

      {children}
    </div>
  );
}
