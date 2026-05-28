import { Megaphone, Clock } from "lucide-react";
import Card from "../Card";
import PageHeader from "../PageHeader";
import EmptyState from "../EmptyState";
import styles from "../../styles/dashboard/AnnouncementsSection.module.css";

export default function AnnouncementsSection({ announcements = [] }) {
  const isNew = (created_at) => {
    const days = (Date.now() - new Date(created_at).getTime()) / (1000 * 60 * 60 * 24);
    return days < 3;
  };

  return (
    <section className={styles.section}>
      <PageHeader
        level={3}
        title="Announcements"
        icon={<Megaphone size={18} />}
      />

      <Card className={styles.card}>
        {announcements.length > 0 ? (
          <div className={styles.list}>
            {announcements.map((announcement) => (
              <article
                key={announcement.id}
                className={`${styles.item} ${isNew(announcement.created_at) ? styles.isNew : ""}`}
              >
                <div className={styles.itemHeader}>
                  <h4 className={styles.title}>{announcement.title}</h4>
                  {isNew(announcement.created_at) && (
                    <span className={styles.badge}>New</span>
                  )}
                </div>

                <p className={styles.message}>{announcement.message}</p>

                <div className={styles.meta}>
                  <Clock size={14} />
                  <span>{new Date(announcement.created_at).toLocaleDateString()}</span>
                  {announcement.author && <span>• {announcement.author}</span>}
                </div>
              </article>
            ))}
          </div>
        ) : (
          <EmptyState
            title="No announcements"
            message="Check back later for updates from your church."
          />
        )}
      </Card>
    </section>
  );
}
