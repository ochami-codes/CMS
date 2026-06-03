import { Users, UserCheck, ArrowLeftRight, UserX } from "lucide-react";

import StatCard from "../../components/StatCard";
import styles from "../../styles/pages/Clerk.module.css";

import { useClerkOverview } from "../../hooks/clerk/useClerkOverview";

export default function ClerkOverview() {
  const { data, loading } = useClerkOverview();

  if (loading) {
    return <p>Loading overview...</p>;
  }

  return (
    <div>
      <h2 className={styles.overviewTitle}>
        📊 Church Overview
      </h2>

      <div className={styles.statsGrid}>

        <StatCard
          title="Total Members"
          value={data?.total_members || 0}
          icon={<Users size={20} />}
        />

        <StatCard
          title="Active Members"
          value={data?.active_members || 0}
          icon={<UserCheck size={20} />}
        />

        <StatCard
          title="Pending Transfers"
          value={data?.pending_transfers || 0}
          icon={<ArrowLeftRight size={20} />}
        />

        <StatCard
          title="Missing Members"
          value={data?.missing_members || 0}
          icon={<UserX size={20} />}
        />

      </div>
    </div>
  );
}