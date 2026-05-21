// components/dashboard/SabbathSection.jsx

import { Calendar } from "lucide-react";

import Card from "../Card";
import PageHeader from "../PageHeader";
import EmptyState from "../EmptyState";

import styles from "../../styles/dashboard/SabbathSection.module.css";

export default function SabbathSection({
  isSabbath,
  sabbathTimer,
}) {
  return (
    <section>

      <PageHeader
        title="Sabbath"
        icon={<Calendar size={18} />}
      />

      <Card>

        {isSabbath ? (

          <div className={styles.message}>
            ✨ Sabbath ongoing.
            May you have a blessed rest.
          </div>

        ) : sabbathTimer ? (

          <div className={styles.timer}>

            <div className={styles.unit}>
              <strong>
                {sabbathTimer.d}
              </strong>

              <span>Days</span>
            </div>

            <div className={styles.unit}>
              <strong>
                {sabbathTimer.h}
              </strong>

              <span>Hours</span>
            </div>

            <div className={styles.unit}>
              <strong>
                {sabbathTimer.m}
              </strong>

              <span>Min</span>
            </div>

            <div className={styles.unit}>
              <strong>
                {sabbathTimer.s}
              </strong>

              <span>Sec</span>
            </div>

          </div>

        ) : (

          <EmptyState
            title="Preparing Sabbath timer"
            description="Please wait..."
          />

        )}

      </Card>

    </section>
  );
}
