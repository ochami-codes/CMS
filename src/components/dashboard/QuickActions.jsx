// components/dashboard/QuickActions.jsx

import {
  Coffee,
  MessageCircle,
} from "lucide-react";

import Card from "../Card";
import PageHeader from "../PageHeader";
import Badge from "../Badge";

import styles from "../../styles/dashboard/QuickActions.module.css";

export default function QuickActions({
  actions,
  unreadMessages,
  isAdmin,
  user,
  onAction,
}) {
  const visibleActions =
    actions.filter((action) => {

      if (
        action.hideForAdmin &&
        isAdmin
      ) {
        return false;
      }

      if (action.permission) {
        return (
          isAdmin ||
          user?.permissions?.includes(
            action.permission
          )
        );
      }

      return true;
    });

  return (
    <section>

      <PageHeader
        title="Quick Actions"
        icon={<Coffee size={18} />}
      />

      <div className={styles.grid}>

        {visibleActions.map((action) => {

          const isMessage =
            action.key === "message";

          return (

            <Card
              key={action.key}
              clickable
              className={styles.card}
              onClick={() =>
                onAction(action.key)
              }
            >

              <div className={styles.icon}>

                {isMessage ? (
                  <>
                    <MessageCircle size={24} />

                    {unreadMessages > 0 && (
                      <Badge type="danger">
                        {unreadMessages}
                      </Badge>
                    )}
                  </>
                ) : (
                  <Coffee size={24} />
                )}

              </div>

              <h4>
                {action.label}
              </h4>

              {isMessage &&
                unreadMessages > 0 && (

                <small
                  className={styles.hint}
                >
                  {unreadMessages}
                  {" "}new message
                  {unreadMessages > 1 &&
                    "s"}
                </small>

              )}

            </Card>

          );
        })}

      </div>

    </section>
  );
}
