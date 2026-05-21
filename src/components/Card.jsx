import styles from "../styles/components/Card.module.css";

export default function Card({
  children,
  title,
  className = "",
}) {
  return (
    <div
      className={`${styles.card} ${className}`}
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
