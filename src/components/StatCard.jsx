import Card from "./Card";
import styles from "../styles/components/StatCard.module.css";

export default function StatCard({
  title,
  value,
  icon
}) {
  return (
    <Card>

      <div className={styles.top}>
        {icon}
      </div>

      <h2 className={styles.value}>
        {value}
      </h2>

      <small className={styles.title}>
        {title}
      </small>

    </Card>
  );
}
