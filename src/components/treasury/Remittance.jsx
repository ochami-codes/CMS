import { useState } from "react";
import {
  ChevronDown,
  ChevronRight,
} from "lucide-react";

import Button from "../../components/Button";
import styles from "../../styles/components/Remittance.module.css";

export default function Remittance({
  open,
  onClose,
  months = [],
  onSubmit,
}) {
  const [expanded, setExpanded] =
    useState({});
  const [selected, setSelected] =
    useState({});
  const [notes, setNotes] =
    useState("");

  if (!open) return null;

  const toggleExpand = month =>
    setExpanded(prev => ({
      ...prev,
      [month]: !prev[month],
    }));

  const toggleSelect = month =>
    setSelected(prev => ({
      ...prev,
      [month]: !prev[month],
    }));

  const total = months.reduce(
    (sum, month) =>
      selected[month.month]
        ? sum + month.total
        : sum,
    0
  );

  return (
    <div className={styles.overlay}>

      <aside className={styles.drawer}>

        <header className={styles.header}>
          <h2>Remit Trust Funds</h2>

          <button
            onClick={onClose}
          >
            ✕
          </button>
        </header>

        <div className={styles.summary}>
          <span>Total Selected</span>

          <strong>
            KES {total.toLocaleString()}
          </strong>
        </div>

        <div className={styles.months}>

          {months.map(month => (

            <div
              key={month.month}
              className={styles.month}
            >

              <div
                className={styles.monthHeader}
              >

                <label>

                  <input
                    type="checkbox"
                    checked={
                      !!selected[
                        month.month
                      ]
                    }
                    onChange={() =>
                      toggleSelect(
                        month.month
                      )
                    }
                  />

                  <span>
                    {month.month}
                  </span>

                </label>

                <div
                  className={
                    styles.right
                  }
                >

                  <strong>
                    KES{" "}
                    {month.total.toLocaleString()}
                  </strong>

                  <button
                    onClick={() =>
                      toggleExpand(
                        month.month
                      )
                    }
                  >
                    {expanded[
                      month.month
                    ] ? (
                      <ChevronDown
                        size={18}
                      />
                    ) : (
                      <ChevronRight
                        size={18}
                      />
                    )}
                  </button>

                </div>

              </div>

              {expanded[
                month.month
              ] && (

                <div
                  className={
                    styles.transactions
                  }
                >

                  {month.transactions.map(
                    tx => (

                      <div
                        key={tx.id}
                        className={
                          styles.transaction
                        }
                      >

                        <span>
                          {tx.fundName}
                        </span>

                        <strong>
                          KES{" "}
                          {tx.amount.toLocaleString()}
                        </strong>

                      </div>

                    )
                  )}

                </div>

              )}

            </div>

          ))}

        </div>

        <textarea
          className={styles.notes}
          rows={4}
          placeholder="Notes (optional)"
          value={notes}
          onChange={e =>
            setNotes(
              e.target.value
            )
          }
        />

        <footer className={styles.footer}>

          <Button
            variant="secondary"
            onClick={onClose}
          >
            Cancel
          </Button>

          <Button
            disabled={total === 0}
            onClick={() =>
              onSubmit({
                months: months
                  .filter(m =>
                    selected[m.month]
                  )
                  .map(
                    m => m.month
                  ),
                notes,
              })
            }
          >
            Remit Funds
          </Button>

        </footer>

      </aside>

    </div>
  );
}