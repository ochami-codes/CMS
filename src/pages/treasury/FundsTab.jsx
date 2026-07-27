import { useState } from "react";
import { Landmark, ChevronDown } from "lucide-react";

import Card from "../../components/Card";
import Button from "../../components/Button";
import ErrorState from "../../components/ErrorState";
import Remittance from "../../components/treasury/Remittance";
import RemittanceHistory from "../../components/treasury/RemittanceHistory";
import useTreasuryFundsSummary from "../../hooks/treasury/useTreasuryFundSummary";
import useRemittances from "../../hooks/treasury/useRemittances";

import styles from "../../styles/pages/Fundstab.module.css";

export default function FundsTab() {
  const [showRemittance, setShowRemittance] = useState(false);
  const [showRemittanceHistory, setShowRemittanceHistory] = useState(false);
  const [expanded, setExpanded] = useState({
    trust: true,
    local: false,
    department: false,
  });

  const { remittances, isLoading, isError, remit, cancel, refresh } = useRemittances();
  const { summary, trustFunds, localFunds, departmentFunds, unremittedMonths } =
    useTreasuryFundsSummary();

  const toggle = (key) =>
    setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));

  const handleRemit = async (payload) => {
    try {
      await remit.mutateAsync(payload);
      setShowRemittance(false);
    } catch (err) {
      console.error("Failed to remit funds:", err);
    }
  };

  const handleCancel = async (remittanceId) => {
    try {
      await cancel.mutateAsync(remittanceId);
    } catch (err) {
      console.error("Failed to cancel remittance:", err);
    }
  };

  const renderFunds = (funds) => (
    <div className={styles.fundList}>
      {funds.map((fund) => (
        <div key={fund.id} className={styles.fundRow}>
          <div>
            <strong>{fund.name}</strong>
            {fund.description && <p className={styles.description}>{fund.description}</p>}
          </div>
          <strong>KES {Number(fund.balance).toLocaleString()}</strong>
        </div>
      ))}
    </div>
  );

  const renderSection = ({ keyName, title, balance, funds, footer }) => (
    <Card className={styles.section}>
      <button
        type="button"
        className={styles.sectionHeader}
        onClick={() => toggle(keyName)}
      >
        <div className={styles.title}>
          <Landmark size={18} />
          <h2>{title}</h2>
        </div>
        <div className={styles.right}>
          <span>KES {balance.toLocaleString()}</span>
          <ChevronDown
            size={18}
            className={expanded[keyName] ? styles.expanded : ""}
          />
        </div>
      </button>

      {expanded[keyName] && (
        <>
          {renderFunds(funds)}
          {footer && <div className={styles.sectionFooter}>{footer}</div>}
        </>
      )}
    </Card>
  );

  if (isError) {
    return (
      <Card className={styles.state}>
        <ErrorState
          message="Failed to load remittances."
          onRetry={refresh}
        />
      </Card>
    );
  }

  return (
    <>
      <section className={styles.container}>
        <div className={styles.summaryGrid}>
          <Card>
            <h3>Total Church Funds</h3>
            <p>KES {summary.overallBalance.toLocaleString()}</p>
          </Card>
          <Card>
            <h3>Trust Funds</h3>
            <p>KES {summary.trustBalance.toLocaleString()}</p>
          </Card>
          <Card>
            <h3>Local Funds</h3>
            <p>KES {summary.localBalance.toLocaleString()}</p>
          </Card>
          <Card>
            <h3>Pending Remittance</h3>
            <p>KES {summary.pendingRemittance.toLocaleString()}</p>
          </Card>
        </div>

        {renderSection({
          keyName: "trust",
          title: "Trust Funds",
          balance: summary.trustBalance,
          funds: trustFunds,
          footer: (
            <div className={styles.actions}>
              <Button
                disabled={summary.pendingRemittance === 0}
                onClick={() => setShowRemittance(true)}
              >
                Remit Trust Funds
              </Button>
              <Button
                variant="secondary"
                onClick={() => setShowRemittanceHistory(true)}
              >
                Remittance History
              </Button>
            </div>
          ),
        })}

        {renderSection({
          keyName: "local",
          title: "Local Funds",
          balance: summary.localBalance,
          funds: localFunds,
        })}

        {departmentFunds.length > 0 &&
          renderSection({
            keyName: "department",
            title: "Departmental Funds",
            balance: summary.departmentBalance,
            funds: departmentFunds,
          })}
      </section>

      <Remittance
        open={showRemittance}
        onClose={() => setShowRemittance(false)}
        months={unremittedMonths}
        onSubmit={handleRemit}
      />

      <RemittanceHistory
        open={showRemittanceHistory}
        onClose={() => setShowRemittanceHistory(false)}
        remittances={remittances}
        loading={isLoading}
        onCancel={handleCancel}
      />
    </>
  );
}
