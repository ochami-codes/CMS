// components/dashboard/QuickActions.jsx

import { Coffee } from "lucide-react";

import Card from "../Card";
import PageHeader from "../PageHeader";

import styles from
"../../styles/dashboard/QuickActions.module.css";

export default function QuickActions({
  actions,
  isAdmin,
  user,
  onAction,
}) {

  const visibleActions =
    actions.filter(action =>
      !(
        action.hideForAdmin &&
        isAdmin
      ) &&
      (
        !action.permission ||
        isAdmin ||
        user?.permissions?.includes(
          action.permission
        )
      )
    );

  return (
    <section>

      <PageHeader
       level={3} 
       title="Quick Actions"
      />

      <div className={styles.grid}>

        {visibleActions.map(
          (action) => (

          <Card
            key={action.key}
            clickable
            className={styles.card}
            onClick={() =>
              onAction(action.key)
            }
          >

            <div className={styles.icon}>
              {action.icon || (
                <Coffee size={24} />
              )}
            </div>

            <h4>
              {action.label}
            </h4>

          </Card>

        ))}

      </div>

    </section>
  );
}
