import { X, Download } from "lucide-react";
import Card from "../Card";
import Button from "../Button";

import styles from "../../styles/components/MemberDetailDrawer.module.css";

export default function MemberDetailDrawer({
  member,
  transactions = [],
  onClose,
  onExport,
}) {
  if (!member) return null;

  const totalTithe = transactions
    .filter((t) => t.type === "tithe")
    .reduce((a, b) => a + b.amount, 0);

  const totalOffering = transactions
    .filter((t) => t.type === "offering")
    .reduce((a, b) => a + b.amount, 0);

  const total = totalTithe + totalOffering;

  return (
    <div className={styles.overlay}>
      <div className={styles.drawer}>

        {/* HEADER */}
        <div className={styles.header}>
          <div>
            <h2>{member.full_name}</h2>
            <p className={styles.meta}>
              Last contribution: {member.last_contribution}
            </p>
          </div>

          <button
            className={styles.closeBtn}
            onClick={onClose}
          >
            <X size={18} />
          </button>
        </div>

        {/* SUMMARY */}
        <div className={styles.summary}>
          <Card>
            <h4>Tithe</h4>
            <p>KES {totalTithe.toLocaleString()}</p>
          </Card>

          <Card>
            <h4>Offerings</h4>
            <p>KES {totalOffering.toLocaleString()}</p>
          </Card>

          <Card>
            <h4>Total</h4>
            <p>KES {total.toLocaleString()}</p>
          </Card>
        </div>

        {/* TRANSACTIONS */}
        <div className={styles.section}>
          <h3>Contribution History</h3>

          <div className={styles.table}>
            {transactions.map((t) => (
              <div key={t.id} className={styles.row}>
                <span>{t.date}</span>
                <span>{t.type}</span>
                <span>{t.fund}</span>
                <span>KES {t.amount.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ACTIONS */}
        <div className={styles.actions}>
          <Button onClick={onExport}>
            <Download size={16} />
            Download Statement
          </Button>
        </div>

      </div>
    </div>
  );
}