import RequirePermission from "../../components/RequirePermission";
import Announcements from "../../components/announcements/Announcements";
import TextDisplay from "../../components/TextDisplay";
import styles from "../../styles/pages/CommunicationDashboard.module.css";
import BackButton from "../../components/BackButton";
export default function CommunicationDashboard() {
  return (
    <RequirePermission permission="access_media_dashboard">
      <BackButton/>
      <main className={`page-container ${styles.page}`}>
        <header className={styles.header}>
          <TextDisplay
            as="h1"
            size="2xl"
            weight="bold"
            color="primary"
          >
            Communication Dashboard
          </TextDisplay>

          <TextDisplay
            as="p"
            size="md"
            color="muted"
          >
            Publish announcements for the entire church.
          </TextDisplay>
        </header>

        <Announcements />
      </main>
    </RequirePermission>
  );
}