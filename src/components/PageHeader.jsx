import styles from "../styles/components/PageHeader.module.css";

export default function PageHeader({
  title,
  subtitle,
  actions,
  level = 1,
  centered = false,
}) {
  const Heading = `h${level}`;

  return (
    <div
      className={`${styles.header} ${
        centered ? styles.centered : ""
      }`}
    >
      <div className={styles.content}>
        <Heading className={styles.title}>
          {title}
        </Heading>

        {subtitle && (
          <p className={styles.subtitle}>
            {subtitle}
          </p>
        )}
      </div>

      {actions && (
        <div className={styles.actions}>
          {actions}
        </div>
      )}
    </div>
  );
}
