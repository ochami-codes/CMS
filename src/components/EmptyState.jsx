import styles from "../styles/components/EmptyState.module.css";

export default function EmptyState({
  icon,
  title = "No data found",
  message = "Nothing to display yet.",
  action
}) {
  return (
    <div className={styles.wrapper}>

      {icon && (
        <div className={styles.icon}>
          {icon}
        </div>
      )}

      <div className={styles.title}>
        {title}
      </div>

      <div className={styles.message}>
        {message}
      </div>

      {action && (
        <div className={styles.action}>
          {action}
        </div>
      )}

    </div>
  );
}
