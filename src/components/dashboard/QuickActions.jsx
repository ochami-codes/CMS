import { Coffee, ArrowRightLeft, BookOpen } from "lucide-react";
import Card from "../Card";
import PageHeader from "../PageHeader";
import styles from "../../styles/dashboard/QuickActions.module.css";

const iconMap = {
  request_role: Coffee,
  transfer: ArrowRightLeft,
  lesson: BookOpen,
};

export default function QuickActions({ actions, isAdmin, user, onAction }) {
  const visibleActions = actions.filter(action =>
    !(action.hideForAdmin && isAdmin) &&
    (!action.permission || isAdmin || user?.permissions?.includes(action.permission))
  );

  return (
    <section className={styles.section}>
      <PageHeader level={3} title="Quick Actions" />

      <div className={styles.grid}>
        {visibleActions.map((action) => {
          const Icon = iconMap[action.key] || Coffee;
          return (
            <Card
              key={action.key}
              className={`${styles.card} ${styles[`card--${action.key}`]}`}
              onClick={() => onAction(action.key)}
            >
              <div className={styles.iconWrap}>
                <Icon size={24} strokeWidth={2} />
              </div>
              <div className={styles.content}>
                <h4>{action.label}</h4>
                {action.description && <p className={styles.desc}>{action.description}</p>}
              </div>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
