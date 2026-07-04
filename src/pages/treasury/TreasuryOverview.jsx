import Card from "../../components/Card";
import StatCard from "../../components/StatCard";
import Button from "../../components/Button";

import styles from "../../styles/pages/TreasuryOverview.module.css";

export default function TreasuryOverview({
  overview,
  isFetching = false,

  onDownloadMonthly,
  onDownloadMembers,
  onExportExcel,
  onPrint,
}) {
  if (!overview) {
    return (
      <Card>
        <p>No treasury data available.</p>
      </Card>
    );
  }

  return (
    <section className={styles.container}>
      <Card>
        <div className={styles.snapshot}>
          <div className={styles.header}>
            <div className={styles.heading}>
  <h2 className={styles.title}>
    Treasury Overview
  </h2>

  {isFetching && (
    <span className={styles.updating}>
      Updating…
    </span>
  )}
</div>

            <p className={styles.summary}>
              Local funds currently stand at{" "}
              <strong>
                KES {overview.total_local_funds?.toLocaleString()}
              </strong>{" "}
              while trust funds total{" "}
              <strong>
                KES {overview.total_trust_funds?.toLocaleString()}
              </strong>
              .
            </p>
          </div>

          <div className={styles.statsGrid}>
            <StatCard
  title="Available Local Balance"
  value={`KES ${overview.available_local_balance?.toLocaleString()}`}
/>

<StatCard
  title="Local Funds"
  value={`KES ${overview.total_local_funds?.toLocaleString()}`}
/>

<StatCard
  title="Trust Funds"
  value={`KES ${overview.total_trust_funds?.toLocaleString()}`}
/>

<StatCard
  title="Unremitted Trust Funds"
  value={`KES ${overview.unremitted_trust_funds?.toLocaleString()}`}
/>

<StatCard
  title="Monthly Expenses"
  value={`KES ${overview.monthly_expenses?.toLocaleString()}`}
/>

          </div>
        </div>
      </Card>

      <Card>
        <div className={styles.reports}>
          <div className={styles.reportHeader}>
            <h2 className={styles.reportTitle}>
              Reports
            </h2>

            <p className={styles.reportDescription}>
              Generate treasury reports, export financial data,
              and prepare documents for board meetings and audits.
            </p>
          </div>

          <div className={styles.quickInfo}>
            <span className={styles.quickInfoLabel}>
              Current Fund Position
            </span>

            <div className={styles.quickInfoValue}>
              KES {overview.total_local_funds?.toLocaleString()}
            </div>
          </div>

          <div className={styles.reportActions}>
            <Button onClick={onDownloadMonthly}>
              Monthly Treasury Report
            </Button>

            <Button
              variant="secondary"
              onClick={onExportExcel}
            >
              Export Excel
            </Button>

            <Button
              variant="outline"
              onClick={onPrint}
            >
              Print Report
            </Button>
          </div>
        </div>
      </Card>
    </section>
  );
}