import { Building2 } from "lucide-react";

import StatCard from "../../components/StatCard";
import TextDisplay from "../../components/TextDisplay";
import styles from "../../styles/pages/PastorDepartments.module.css";

export default function PastorDepartments({
  departments = [],
  isFetching,
}) {
  return (
    <section className={styles.page}>
      <header className={styles.header}>
        <div>
          <TextDisplay
            as="h2"
            size="2xl"
            weight="bold"
            color="primary"
          >
            Departments
          </TextDisplay>

          <TextDisplay
            as="p"
            size="md"
            color="muted"
          >
            Overview of church departments and their
            current membership.
          </TextDisplay>
        </div>

        {isFetching && (
          <span className={styles.refreshing}>
            Updating...
          </span>
        )}
      </header>

      {departments.length === 0 ? (
        <div className={styles.empty}>
          No departments found.
        </div>
      ) : (
        <div className={styles.grid}>
          {departments.map((department) => (
            <StatCard
              key={department.id}
              title={department.name}
              value={department.memberCount}
              icon={<Building2 size={22} />}
            />
          ))}
        </div>
      )}
    </section>
  );
}