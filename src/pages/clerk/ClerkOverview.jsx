import { Users, UserCheck, ArrowLeftRight, UserX } from "lucide-react";

import StatCard from "../../components/StatCard";
import styles from "../../styles/pages/Clerk.module.css";

export default function ClerkOverview() {
  return (
    <div>

      <h2 className={styles.overviewTitle}>
        📊 Church Overview
      </h2>

      <div className={styles.statsGrid}>

        <StatCard
          title="Total Members"
          value="--"
          icon={<Users size={20} />}
        />

        <StatCard
          title="Active Members"
          value="--"
          icon={<UserCheck size={20} />}
        />

        <StatCard
          title="Pending Transfers"
          value="--"
          icon={<ArrowLeftRight size={20} />}
        />

        <StatCard
          title="Missing Members"
          value="--"
          icon={<UserX size={20} />}
        />

      </div>

    </div>
  );
}
