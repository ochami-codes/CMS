import { Megaphone, Clock } from "lucide-react";

import Card from "../Card";
import PageHeader from "../PageHeader";
import EmptyState from "../EmptyState";

import styles from "../../styles/dashboard/AnnouncementsSection.module.css";

export default function AnnouncementsSection({
  churchAnnouncements = [],
  departmentAnnouncements = [],
}) {
  const isNew = (createdAt) => {
    const days =
      (Date.now() - new Date(createdAt).getTime()) /
      (1000 * 60 * 60 * 24);
    return days < 3;
  };

  const renderAnnouncements = (announcements, emptyMessage) => {
    if (announcements.length === 0) {
      return (
        <EmptyState
          title="No announcements"
          message={emptyMessage}
        />
      );
    }

    return (
      <div className={styles.list}>
        {announcements.map((announcement) => {
          const newAnnouncement = isNew(announcement.created_at);

          return (
            <article
              key={announcement.id}
              className={`${styles.item} ${newAnnouncement ? styles.isNew : ""}`}
            >
              <div className={styles.itemHeader}>
                <h4 className={styles.title}>{announcement.title}</h4>
                {newAnnouncement && <span className={styles.badge}>New</span>}
              </div>

              <p className={styles.message}>{announcement.message}</p>

              <div className={styles.meta}>
                <Clock size={14} />
                <span>{new Date(announcement.created_at).toLocaleDateString()}</span>
                {announcement.author && <span> • {announcement.author}</span>}
              </div>
            </article>
          );
        })}
      </div>
    );
  };

  return (
    <section className={styles.section}>
      <PageHeader
        level={3}
        title="Announcements"
        icon={<Megaphone size={18} />}
      />

      <div className={styles.grid}>
        <Card className={styles.card}>
          <h4 className={styles.heading}>Church-wide</h4>
          {renderAnnouncements(churchAnnouncements, "No church-wide announcements.")}
        </Card>

        <Card className={styles.card}>
          <h4 className={styles.heading}>Department</h4>
          {renderAnnouncements(departmentAnnouncements, "No department announcements.")}
        </Card>
      </div>
    </section>
  );
}


