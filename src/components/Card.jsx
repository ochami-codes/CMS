import styles from "../styles/components/Card.module.css";

export default function Card({
  children,
  title,
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
        <h3 className={styles.title}>
          {title}
        </h3>
      )}

      {children}
    </div>
  );
}
