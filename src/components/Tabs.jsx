import Button from "./Button";

import styles from "../styles/components/Tabs.module.css";

export default function Tabs({
  tabs,
  activeTab,
  onChange,
  actions,
}) {
  return (
    <div className={styles.container}>
      <div className={styles.tabs}>
        {tabs.map(
          ({
            key,
            label,
            Icon,
            badge,
          }) => {
            const isActive =
              activeTab === key;

            return (
              <Button
                key={key}
                size="sm"
                variant={
                  isActive
                    ? "primary"
                    : "ghost"
                }
                className={
                  styles.tabButton
                }
                onClick={() =>
                  onChange(key)
                }
              >
                {Icon && (
                  <Icon
                    size={16}
                    className={
                      styles.icon
                    }
                  />
                )}

                <span>
                  {label}
                </span>

                {!!badge && (
                  <span
                    className={
                      styles.badge
                    }
                  >
                    {badge}
                  </span>
                )}
              </Button>
            );
          }
        )}
      </div>

      {actions && (
        <div
          className={
            styles.actions
          }
        >
          {actions}
        </div>
      )}
    </div>
  );
}