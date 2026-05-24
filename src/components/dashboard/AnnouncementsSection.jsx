// components/dashboard/AnnouncementsSection.jsx

import { Megaphone } from "lucide-react";

import Card from "../Card";
import PageHeader from "../PageHeader";
import EmptyState from "../EmptyState";

import styles from "../../styles/dashboard/AnnouncementsSection.module.css";

export default function AnnouncementsSection({
  announcements = [],
}) {

  return (

    <section className={styles.section}>

      <PageHeader
        level={3}
        title="Announcements"
        icon={<Megaphone size={18} />}
      />

      <Card>

        {announcements.length > 0 ? (

          <div className={styles.list}>

            {announcements.map(
              (announcement) => (

              <article
                key={announcement.id}
                className={styles.item}
              >

                <h4 className={styles.title}>
                  {announcement.title}
                </h4>

                <p className={styles.message}>
                  {announcement.message}
                </p>

              </article>

            ))}

          </div>

        ) : (

          <EmptyState
            title="No announcements"
            message="Nothing has been shared yet."
          />

        )}

      </Card>

    </section>

  );
}
