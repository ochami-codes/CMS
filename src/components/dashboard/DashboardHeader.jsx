import { Home } from "lucide-react";
import styles from "../../styles/dashboard/DashboardHeader.module.css";

export default function DashboardHeader({ churchName, greeting, verse }) {
  return (
    <section className={styles.hero}>
      <div className={styles.heroBg} />
      
      <div className={styles.heroContent}>
        <div className={styles.top}>
          <div className={styles.title}>
            <div className={styles.iconWrap}>
              <Home size={22} strokeWidth={2.5} />
            </div>
            <h2>{churchName}</h2>
          </div>

          <p className={styles.greeting}>{greeting}</p>
        </div>

        {verse && (
          <blockquote className={styles.verse}>
            <span className={styles.verseQuote}>“</span>
            <p>{verse.text}</p>
            <footer>— {verse.reference}</footer>
          </blockquote>
        )}
      </div>
    </section>
  );
}
