import RequirePermission from "../../components/RequirePermission";
import Announcements from "../../components/announcements/Announcements";

import styles from "../../styles/pages/CommunicationDashboard.module.css";

export default function CommunicationDashboard() {
  return (
    <RequirePermission permission="access_media_dashboard">
      <main className={`page-container ${styles.page}`}>
        <header className={styles.header}>
          <h1 className={styles.title}>
            Communication Dashboard
          </h1>

          <p className={styles.subtitle}>
            Publish announcements for the entire church.
          </p>
        </header>

        <Announcements />
      </main>
    </RequirePermission>
  );
}