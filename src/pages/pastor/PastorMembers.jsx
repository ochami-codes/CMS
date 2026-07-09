import {
  Baby,
  Users,
  UserRound,
} from "lucide-react";

import StatCard from "../../components/StatCard";
import ResponsiveDataView from "../../components/ResponsiveDataView";

import styles from "../../styles/pages/PastorMembers.module.css";

export default function PastorMembers({
  summary = {},
  members = [],
  isFetching,
}) {
  const columns = [
    {
      key: "full_name",
      label: "Name",
    },
    {
      key: "phone",
      label: "Phone",
    },
    {
      key: "gender",
      label: "Gender",
    },
  ];

  return (
    <section className={styles.page}>
      <header className={styles.header}>
        <div>
          <h2 className={styles.title}>
            Members
          </h2>

          <p className={styles.subtitle}>
            Overview of church membership and
            contact information.
          </p>
        </div>

        {isFetching && (
          <span className={styles.refreshing}>
            Updating...
          </span>
        )}
      </header>

      <div className={styles.summaryGrid}>
        <StatCard
          title="Total Members"
          value={summary.totalMembers ?? 0}
          icon={<Users size={22} />}
        />

        <StatCard
          title="Children"
          value={summary.totalChildren ?? 0}
          icon={<Baby size={22} />}
        />

        <StatCard
          title="Male"
          value={summary.totalMale ?? 0}
          icon={<UserRound size={22} />}
        />

        <StatCard
          title="Female"
          value={summary.totalFemale ?? 0}
          icon={<UserRound size={22} />}
        />
      </div>

      <section className={styles.tableSection}>
        <ResponsiveDataView
          columns={columns}
          data={members}
          loading={isFetching}
          emptyMessage="No members found."
        />
      </section>
    </section>
  );
}