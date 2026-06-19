import { X, Download } from "lucide-react";
import Card from "../Card";
import Button from "../Button";

import styles from "../../styles/components/FundDetailDrawer.module.css";

export default function FundDetailDrawer({
  fund,
  transactions = [],
  onClose,
  onExport,
}) {
  if (!fund) return null;

  /* ---------------- METRICS ---------------- */
  const inflow = transactions
    .filter((t) => t.type === "income")
    .reduce((a, b) => a + b.amount, 0);

  const outflow = transactions
    .filter((t) => t.type === "expense")
    .reduce((a, b) => a + b.amount, 0);

  const net = inflow - outflow;

  return (
    <div className={styles.overlay}>
      <div className={styles.drawer}>

        {/* HEADER */}
        <div className={styles.header}>
          <div>
            <h2>{fund.fund_name}</h2>
            <p className={styles.meta}>
              Group: {fund.group_name}
            </p>
          </div>

          <button
            className={styles.closeBtn}
            onClick={onClose}
          >
            <X size={18} />
          </button>
        </div>

        {/* SNAPSHOT */}
        <div className={styles.summary}>
          <Card>
            <h4>Inflow</h4>
            <p>KES {inflow.toLocaleString()}</p>
          </Card>

          <Card>
            <h4>Outflow</h4>
            <p>KES {outflow.toLocaleString()}</p>
          </Card>

          <Card>
            <h4>Net</h4>
            <p>KES {net.toLocaleString()}</p>
          </Card>
        </div>

        {/* TRANSACTIONS */}
        <div className={styles.section}>
          <h3>Fund Transactions</h3>

          <div className={styles.table}>
            {transactions.map((t) => (
              <div key={t.id} className={styles.row}>
                <span>{t.date}</span>
                <span>{t.type}</span>
                <span>{t.category}</span>
                <span>KES {t.amount.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ACTIONS */}
        <div className={styles.actions}>
          <Button onClick={onExport}>
            <Download size={16} />
            Export Report
          </Button>
        </div>

      </div>
    </div>
  );
}