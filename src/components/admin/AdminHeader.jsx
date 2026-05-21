import Card from "../Card";
import styles from "../../styles/admin/AdminHeader.module.css";

export default function AdminHeader() {
  return (
    <Card className={styles.card}>

      <h2 className={styles.title}>
        Welcome, Admin!
      </h2>

      <p className={styles.subtitle}>
        Use this dashboard to:
      </p>

      <ul className={styles.list}>
        <li>Manage church members</li>
        <li>Approve or reject role requests</li>
        <li>Assign roles and permissions</li>
      </ul>

    </Card>
  );
}
