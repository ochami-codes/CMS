import { formatDate } from "../../../utils/formatDate";
import styles from "../../../styles/profiles/Contribution.module.css";
import ResponsiveDataView from "../../../components/ResponsiveDataView";
export default function Contributions({
  summary = {},
  transactions = [],
}) {
  const recentTransactions = transactions.slice(0, 5);

const transactionColumns = [
  {
    key: "fund",
    label: "Fund",
  },
  {
    key: "date",
    label: "Date",
    render: (value) => formatDate(value),
  },
  {
    key: "amount",
    label: "Amount",
    render: (value) =>
      `KES ${Number(value).toLocaleString()}`,
  },
];
  return (
    <section className={styles.card}>

      <h3 className={styles.title}>
        Contributions Summary
      </h3>

      <div className={styles.list}>

        {(summary.fundTotals ?? []).map((fund) => (

          <div
            key={fund.fund_id}
            className={styles.row}
          >
            <span className={styles.label}>
              {fund.fund_name}
            </span>

            <span className={styles.value}>
              KES {Number(fund.total).toLocaleString()}
            </span>

          </div>

        ))}

      </div>

      <div className={styles.divider}>

        <div className={styles.row}>
          <span>Total Giving</span>

          <strong>
            KES {Number(summary.totalGiving ?? 0).toLocaleString()}
          </strong>
        </div>

        <div className={styles.row}>
          <span>Contributions</span>

          <strong>
            {summary.contributions ?? 0}
          </strong>
        </div>

      </div>

      <div className={styles.history}>

  <h4 className={styles.subtitle}>
    Recent Contributions
  </h4>

  {recentTransactions.length === 0 ? (

    <p className={styles.empty}>
      No recent contributions.
    </p>

  ) : (

    <ResponsiveDataView
      columns={transactionColumns}
      data={recentTransactions}
    />

  )}

</div>

    </section>
  );
}