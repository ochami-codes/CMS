import { Calendar, Sun } from "lucide-react";
import Card from "../Card";
import PageHeader from "../PageHeader";
import EmptyState from "../EmptyState";
import styles from "../../styles/dashboard/SabbathSection.module.css";

export default function SabbathSection({ isSabbath, sabbathTimer }) {
  return (
    <section className={styles.section}>
      <PageHeader level={3} title="Sabbath" icon={<Calendar size={18} />} />

      <Card className={`${styles.card} ${isSabbath ? styles.cardActive : ""}`}>
        {isSabbath ? (
          <div className={styles.message}>
            <Sun size={28} className={styles.sunIcon} />
            <div>
              <h4>Sabbath Ongoing</h4>
              <p>May you have a blessed rest.</p>
            </div>
          </div>
        ) : sabbathTimer ? (
          <div className={styles.timer}>
            {[
              { label: "Days", value: sabbathTimer.d },
              { label: "Hours", value: sabbathTimer.h },
              { label: "Min", value: sabbathTimer.m },
              { label: "Sec", value: sabbathTimer.s },
            ].map((unit, i) => (
              <div key={unit.label} className={styles.unit}>
                <strong>{String(unit.value).padStart(2, "0")}</strong>
                <span>{unit.label}</span>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState title="Preparing Sabbath timer" description="Please wait..." />
        )}
      </Card>
    </section>
  );
}
