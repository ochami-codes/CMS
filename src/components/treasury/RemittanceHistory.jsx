import Button from "../Button";
import Card from "../Card";

import styles from "../../styles/components/RemittanceHistory.module.css";

const formatDate = date =>
  new Date(date).toLocaleDateString();

const formatAmount = amount =>
  Number(amount).toLocaleString();

export default function RemittanceHistory({
  open,
  onClose,
  remittances = [],
  loading,
  onCancel,
}) {
  if (!open) return null;

  return (
    <div
      className={styles.overlay}
      onClick={onClose}
    >
      <Card
        className={styles.modal}
        onClick={e => e.stopPropagation()}
      >
        <div className={styles.header}>
          <h2>Remittance History</h2>

          <Button
            variant="ghost"
            onClick={onClose}
          >
            ✕
          </Button>
        </div>

        {loading ? (
          <div className={styles.empty}>
            Loading...
          </div>
        ) : remittances.length === 0 ? (
          <div className={styles.empty}>
            No remittances found.
          </div>
        ) : (
          <div className={styles.list}>
            {remittances.map(
              ({
                id,
                remittance_number,
                remittance_date,
                total_amount,
                status,
                notes,
                items = [],
              }) => {
                const statusClass =
                  status === "cancelled"
                    ? styles.cancelled
                    : styles.remitted;

                return (
                  <Card
                    key={id}
                    className={styles.item}
                  >
                    <div className={styles.row}>
                      <span>Number</span>
                      <strong>
                        {remittance_number}
                      </strong>
                    </div>

                    <div className={styles.row}>
                      <span>Date</span>
                      <strong>
                        {formatDate(
                          remittance_date
                        )}
                      </strong>
                    </div>

                    <div className={styles.row}>
                      <span>Amount</span>
                      <strong>
                        KES{" "}
                        {formatAmount(
                          total_amount
                        )}
                      </strong>
                    </div>

                    <div className={styles.row}>
                      <span>Status</span>

                      <span
                        className={`${styles.status} ${statusClass}`}
                      >
                        {status}
                      </span>
                    </div>

                    {notes && (
                      <p className={styles.notes}>
                        {notes}
                      </p>
                    )}

                    {items.length > 0 && (
                      <div
                        className={styles.items}
                      >
                        {items.map(
                          ({
                            id,
                            fundName,
                            amount,
                          }) => (
                            <div
                              key={id}
                              className={
                                styles.itemRow
                              }
                            >
                              <span>
                                {fundName}
                              </span>

                              <strong>
                                KES{" "}
                                {formatAmount(
                                  amount
                                )}
                              </strong>
                            </div>
                          )
                        )}
                      </div>
                    )}

                    {status ===
                      "remitted" && (
                      <div
                        className={
                          styles.actions
                        }
                      >
                        <Button
                          onClick={() =>
                            onCancel(id)
                          }
                        >
                          Cancel
                          Remittance
                        </Button>
                      </div>
                    )}
                  </Card>
                );
              }
            )}
          </div>
        )}
      </Card>
    </div>
  );
}