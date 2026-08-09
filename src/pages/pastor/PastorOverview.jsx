import {
  Building2,
  Landmark,
  Users,
  Baby,
} from "lucide-react";

import StatCard from "../../components/StatCard";
import TextDisplay from "../../components/TextDisplay";
import styles from "../../styles/pages/PastorOverview.module.css";

export default function PastorOverview({
  overview = {},
  isFetching,
}) {
  const cards = [
    {
      title: "Total Members",
      value: overview.totalMembers ?? 0,
      icon: <Users size={22} />,
    },
    {
      title: "Children",
      value: overview.totalChildren ?? 0,
      icon: <Baby size={22} />,
    },
    {
      title: "Departments",
      value: overview.totalDepartments ?? 0,
      icon: <Building2 size={22} />,
    },
    {
      title: "Church Funds",
      value: `KES ${Number(
        overview.totalFunds ?? 0
      ).toLocaleString()}`,
      icon: <Landmark size={22} />,
    },
  ];

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
            Church Overview
          </TextDisplay>

          <TextDisplay
            as="p"
            size="md"
            color="muted"
          >
            A summary of your church's current
            membership, departments and finances.
          </TextDisplay>
        </div>

        {isFetching && (
          <span className={styles.refreshing}>
            Updating...
          </span>
        )}
      </header>

      <div className={styles.grid}>
        {cards.map((card) => (
          <StatCard
            key={card.title}
            title={card.title}
            value={card.value}
            icon={card.icon}
          />
        ))}
      </div>
    </section>
  );
}
