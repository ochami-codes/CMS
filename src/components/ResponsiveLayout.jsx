import styles from
"../styles/components/ResponsiveLayout.module.css";

export default function ResponsiveLayout({
  desktop,
  mobile,
}) {
  return (

    <>
      <div className={styles.desktop}>
        {desktop}
      </div>

      <div className={styles.mobile}>
        {mobile}
      </div>
    </>

  );
}
