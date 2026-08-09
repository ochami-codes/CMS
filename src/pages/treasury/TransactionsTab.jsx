import { useState } from "react";
import {
  Plus,
  ArrowDownCircle,
  ArrowUpCircle,
  Landmark,
  X,
} from "lucide-react";

import Card from "../../components/Card";
import Button from "../../components/Button";
import ResponsiveDataView from "../../components/ResponsiveDataView";
import ErrorState from "../../components/ErrorState";
import { formatDate } from "../../utils/formatDate";
import ReceiveFundsForm from "../../components/treasury/ReceiveFundsForm";
import RecordExpenseForm from "../../components/treasury/RecordExpenseForm";
import AddFundForm from "../../components/treasury/AddFundForm";
import useTreasuryTransactions from "../../hooks/treasury/useTreasuryTransactions";
import TextDisplay from "../../components/TextDisplay";
import styles from "../../styles/pages/TransactionsTab.module.css";

export default function TransactionsTab({ onRefresh }) {
  const { transactions, summary, refresh, isError } = useTreasuryTransactions();
  const [activeForm, setActiveForm] = useState(null);

  const closeForm = () => setActiveForm(null);

  const handleSuccess = () => {
    closeForm();
    refresh();
    onRefresh?.();
  };

  const columns = [
    {
      key: "transaction_date",
      label: "Date",
      render: (value) => formatDate(value, { month: "long" }),
    },
    { key: "fund_name", label: "Fund" },
    { key: "member_name", label: "Contributor" },
    {
      key: "amount",
      label: "Amount",
      render: (value) => `KES ${Number(value).toLocaleString()}`,
    },
    { key: "recorded_by_name", label: "Recorded By" },
  ];

  if (isError) {
    return (
      <Card className={styles.state}>
        <ErrorState
          message="Failed to load transactions."
          onRetry={refresh}
        />
      </Card>
    );
  }

  return (
    <section className={styles.container}>
      <div className={styles.header}>
        <div>
          <TextDisplay
            as="h2"
            size="2xl"
            weight="bold"
            color="primary"
          >
            Transactions
          </TextDisplay>
          <TextDisplay
            as="p"
            size="md"
            color="muted"
          >
            Record income, expenses and manage funds
          </TextDisplay>
        </div>
      </div>

      <div className={styles.actions}>
        <Card
          className={styles.actionCard}
          onClick={() => setActiveForm("income")}
        >
          <ArrowDownCircle size={32} />
          <div>
            <h3>Receive Funds</h3>
            <p>Tithe, offerings, contributions</p>
          </div>
          <Plus size={18} />
        </Card>

        <Card
          className={styles.actionCard}
          onClick={() => setActiveForm("expense")}
        >
          <ArrowUpCircle size={32} />
          <div>
            <h3>Record Expense</h3>
            <p>Payments and spending</p>
          </div>
          <Plus size={18} />
        </Card>

        <Card
          className={styles.actionCard}
          onClick={() => setActiveForm("fund")}
        >
          <Landmark size={32} />
          <div>
            <h3>Add Fund</h3>
            <p>Create local or departmental fund</p>
          </div>
          <Plus size={18} />
        </Card>
      </div>

      {activeForm && (
        <div className={styles.overlay}>
          <div className={styles.modal}>
            <button className={styles.close} onClick={closeForm}>
              <X size={20} />
            </button>

            {activeForm === "income" && (
              <ReceiveFundsForm onSuccess={handleSuccess} onCancel={closeForm} />
            )}
            {activeForm === "expense" && (
              <RecordExpenseForm onSuccess={handleSuccess} onCancel={closeForm} />
            )}
            {activeForm === "fund" && (
              <AddFundForm onSuccess={handleSuccess} onCancel={closeForm} />
            )}
          </div>
        </div>
      )}

      <div className={styles.summary}>
        <Card>
          <span>Today's Records</span>
          <strong>{summary.today_count ?? 0}</strong>
        </Card>

        <Card>
          <span>Amount Recorded Today</span>
          <strong className={styles.income}>
            KES {summary.today_recorded?.toLocaleString() ?? 0}
          </strong>
        </Card>

        <Card>
          <span>Today's Expenses</span>
          <strong className={styles.expense}>
            KES {summary.today_expenses?.toLocaleString() ?? 0}
          </strong>
        </Card>
      </div>

      <Card className={styles.history}>
        <h3>Recent Transactions</h3>
        <ResponsiveDataView columns={columns} data={transactions} />
      </Card>
    </section>
  );
}
