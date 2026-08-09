import styles from "../styles/components/BadgeList.module.css";

export default function BadgeList({
  items = [],
  emptyLabel = "—",
  getKey,
  getLabel,
  className = "",
}) {
  if (!items?.length) {
    return (
      <span className={styles.empty}>
        {emptyLabel}
      </span>
    );
  }

  // Resolve a stable key for any supported item type
  const resolveKey = (item, index) => {
    if (getKey) {
      return getKey(item);
    }

    if (item && typeof item === "object") {
      return item.id ?? item.name ?? item.label ?? index;
    }

    return item ?? index;
  };

  // Resolve a display label for any supported item type
  const resolveLabel = (item) => {
    if (getLabel) {
      return getLabel(item);
    }

    if (item && typeof item === "object") {
      return item.label ?? item.name ?? item.id ?? "";
    }

    return String(item ?? "");
  };

  return (
    <div className={`${styles.list} ${className}`}>
      {items.map((item, index) => (
        <span
          key={resolveKey(item, index)}
          className={styles.badge}
        >
          {resolveLabel(item)}
        </span>
      ))}
    </div>
  );
}