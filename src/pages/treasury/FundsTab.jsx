import { useMemo, useState } from "react";
import { ChevronDown, Landmark } from "lucide-react";

import Card from "../../components/Card";
import Button from "../../components/Button";

export default function FundsTab({ groups = [] }) {
  const [openGroup, setOpenGroup] = useState(null);

  /* ---------------- SUMMARY ---------------- */
  const summary = useMemo(() => {
    let total = 0;

    groups.forEach((g) => {
      total += g.total_balance || 0;
    });

    return {
      totalFunds: groups.length,
      totalBalance: total,
    };
  }, [groups]);

  return (
    <section className={styles.container}>

      {/* SUMMARY CARDS */}
      <div className={styles.summaryGrid}>
        <Card>
          <h3>Total Funds</h3>
          <p>{summary.totalFunds}</p>
        </Card>

        <Card>
          <h3>Total Balance</h3>
          <p>KES {summary.totalBalance.toLocaleString()}</p>
        </Card>

        <Card>
          <h3>Active Groups</h3>
          <p>{groups.length}</p>
        </Card>

        <Card>
          <h3>Departments</h3>
          <p>
            {groups.reduce(
              (acc, g) => acc + (g.departments?.length || 0),
              0
            )}
          </p>
        </Card>
      </div>

      {/* FUND GROUPS */}
      <div className={styles.groupList}>
        {groups.map((group) => {
          const isOpen = openGroup === group.group_id;

          return (
            <Card key={group.group_id}>

              {/* GROUP HEADER */}
              <div
                className={styles.groupHeader}
                onClick={() =>
                  setOpenGroup(isOpen ? null : group.group_id)
                }
              >
                <div className={styles.groupTitle}>
                  <Landmark size={16} />
                  <h3>{group.group_name}</h3>
                </div>

                <div className={styles.groupMeta}>
                  <span>
                    KES {group.total_balance?.toLocaleString()}
                  </span>

                  <ChevronDown
                    className={`${styles.chevron} ${
                      isOpen ? styles.rotate : ""
                    }`}
                    size={18}
                  />
                </div>
              </div>

              {/* EXPANDED CONTENT */}
              {isOpen && (
                <div className={styles.groupBody}>

                  {/* FUND LIST */}
                  <div className={styles.fundList}>
                    {group.funds?.map((fund) => (
                      <div
                        key={fund.fund_id}
                        className={styles.fundRow}
                      >
                        <div>
                          <strong>{fund.fund_name}</strong>
                          <p className={styles.muted}>
                            {fund.description || "No description"}
                          </p>
                        </div>

                        <span>
                          KES{" "}
                          {fund.balance?.toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* DEPARTMENTS */}
                  {group.departments?.length > 0 && (
                    <div className={styles.departmentBlock}>
                      <h4>Departmental Funds</h4>

                      <div className={styles.departmentGrid}>
                        {group.departments.map((d) => (
                          <div
                            key={d.department_id}
                            className={styles.departmentCard}
                          >
                            <h5>{d.name}</h5>
                            <p>
                              KES{" "}
                              {d.balance?.toLocaleString()}
                            </p>

                            <Button size="sm" variant="secondary">
                              View
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                </div>
              )}

            </Card>
          );
        })}
      </div>

    </section>
  );
}
