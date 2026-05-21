import styles from "../styles/components/Loader.module.css";

export default function Loader({
  message = "Loading...",
  fullScreen = true
}) {
  if (fullScreen) {
    return (
      <div className={styles.overlay}>

        <div className={styles.card}>

          <div className={styles.spinner} />

          <p className={styles.text}>
            {message}
          </p>

        </div>

      </div>
    );
  }

  // INLINE version
  return (
    <div className={styles.inline}>

      <div className={styles.spinner} />

      <p className={styles.text}>
        {message}
      </p>

    </div>
  );
}
