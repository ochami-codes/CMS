import { useState } from "react";
import { Download, Printer, X } from "lucide-react";

import Card from "../Card";
import Button from "../Button";
import ResponsiveDataView from "../ResponsiveDataView";
import { formatDate } from "../../utils/formatDate";
import ErrorState from "../ErrorState";
import useMemberGivingLedger from "../../hooks/treasury/useMemberGivingLedger";

import styles from "../../styles/components/MemberLedgerDrawer.module.css";

export default function MemberLedgerDrawer({ member, onClose }) {
  const [period, setPeriod] = useState("monthly");

  const {
    member: ledgerMember,
    summary,
    transactions,
    isError,
    loading,
    refresh,
  } = useMemberGivingLedger(member?.id);

  if (!member) return null;

  const columns = [
    {
      key: "date",
      label: "Date",
      render: (value) => formatDate(value, { month: "long" }),
    },
    { key: "fund", label: "Fund" },
    {
      key: "amount",
      label: "Amount",
      render: (value) => `KES ${Number(value).toLocaleString()}`,
    },
  ];

  return (
    <div className={styles.overlay} onClick={onClose}>
      <Card className={styles.drawer} onClick={(e) => e.stopPropagation()}>
        <header className={styles.header}>
          <div>
            <h2 className={styles.name}>
              {ledgerMember?.full_name ?? member.full_name}
            </h2>
            <p className={styles.sub}>
              {ledgerMember?.phone ?? member.phone ?? "No phone number"}
            </p>
          </div>
          <button type="button" className={styles.close} onClick={onClose}>
            <X size={22} />
          </button>
        </header>

        {isError ? (
          <ErrorState
            message="Failed to load member ledger."
            onRetry={refresh}
          />
        ) : (
          <>
            {/* Summary */}
            <section className={styles.summaryGrid}>
              {loading ? (
                <div className={styles.loaderContainer}>
                  <div>Loading...</div>
                </div>
              ) : (
                <>
                  <Card className={styles.summaryCard}>
                    <h4>Contributions</h4>
                    <p>{summary.contributions ?? 0}</p>
                  </Card>
                  <Card className={styles.summaryCard}>
                    <h4>Total Giving</h4>
                    <p>KES {(summary.totalGiving ?? 0).toLocaleString()}</p>
                  </Card>
                  <Card className={styles.summaryCard}>
                    <h4>Total Tithe</h4>
                    <p>KES {(summary.totalTithe ?? 0).toLocaleString()}</p>
                  </Card>
                </>
              )}
            </section>

            {/* Contribution Ledger */}
            <section className={styles.section}>
              <div className={styles.sectionHeader}>
                <h3>Contribution Ledger</h3>
              </div>
              <ResponsiveDataView
                loading={loading}
                columns={columns}
                data={transactions}
                emptyMessage="No contributions recorded."
              />
            </section>

            {/* Summary by Fund */}
            <section className={styles.section}>
              <div className={styles.sectionHeader}>
                <h3>Summary by Fund</h3>
                <select
                  value={period}
                  onChange={(e) => setPeriod(e.target.value)}
                  className={styles.select}
                >
                  <option value="monthly">Monthly</option>
                  <option value="quarterly">Quarterly</option>
                  <option value="yearly">Yearly</option>
                </select>
              </div>

              <Card className={styles.summaryTable}>
                {(summary.fundTotals ?? []).map((fund) => (
                  <div key={fund.fund_id} className={styles.totalRow}>
                    <span>{fund.fund_name}</span>
                    <strong>KES {Number(fund.total).toLocaleString()}</strong>
                  </div>
                ))}
                <div className={`${styles.totalRow} ${styles.grandTotal}`}>
                  <span>Grand Total</span>
                  <strong>
                    KES {(summary.totalGiving ?? 0).toLocaleString()}
                  </strong>
                </div>
              </Card>
            </section>
          </>
        )}

        <footer className={styles.actions}>
          <Button variant="danger" onClick={onClose}>
            Close
          </Button>
        </footer>
      </Card>
    </div>
  );
}
