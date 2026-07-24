import {
  Users,
  ShieldCheck,
  UserCog,
} from "lucide-react";

import Card from "../Card";
import styles from "../../styles/admin/AdminHeader.module.css";

export default function AdminHeader() {
  return (
    <Card className={styles.card}>
      <div className={styles.header}>
        <div>
          <h2 className={styles.title}>Admin Dashboard</h2>
          <p className={styles.subtitle}>
            Manage members, roles, and access.
          </p>
        </div>
      </div>

      <div className={styles.features}>
        <div className={styles.feature}>
          <Users size={18} />
          <span>Members</span>
        </div>

        <div className={styles.feature}>
          <ShieldCheck size={18} />
          <span>Permissions</span>
        </div>

        <div className={styles.feature}>
          <UserCog size={18} />
          <span>Roles</span>
        </div>
      </div>
    </Card>
  );
}
