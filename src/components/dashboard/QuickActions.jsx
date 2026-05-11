// components/dashboard/QuickActions.jsx

import { Coffee, MessageCircle } from "lucide-react";

export default function QuickActions({
  actions,
  unreadMessages,
  isAdmin,
  user,
  onAction,
}) {
  return (
    <section className="dashboard-section">
      <div className="dashboard-section-header">
        <Coffee size={18} />
        Quick Actions
      </div>

      <div className="dashboard-actions">

        {actions
          .filter((action) => {

            // hide admin-only actions
            if (
              action.hideForAdmin &&
              isAdmin
            ) {
              return false;
            }

            // optional permission check
            if (action.permission) {
              return (
                isAdmin ||
                user?.permissions?.includes(
                  action.permission
                )
              );
            }

            return true;
          })

          .map((action) => (
            <button
              key={action.key}
              className={`dashboard-action-card ${
                action.key === "message"
                  ? "message"
                  : ""
              }`}
              onClick={() =>
                onAction(action.key)
              }
            >

              {/* ICON */}

              {action.key === "message" ? (
                <div className="icon-wrapper">

                  <MessageCircle size={24} />

                  {unreadMessages > 0 && (
                    <span className="badge unread">
                      {unreadMessages}
                    </span>
                  )}

                </div>
              ) : (
                <Coffee size={24} />
              )}

              {/* LABEL */}

              <h3>{action.label}</h3>

              {/* HINT */}

              {action.key === "message" &&
                unreadMessages > 0 && (
                  <small className="action-hint">
                    {unreadMessages} new
                    message
                    {unreadMessages > 1 &&
                      "s"}
                  </small>
              )}

            </button>
          ))}

      </div>
    </section>
  );
}
