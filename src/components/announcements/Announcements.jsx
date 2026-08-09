// src/components/Announcements.jsx

import { useState } from "react";

import Card from "../Card";
import Input from "../Input";
import Button from "../Button";
import Loader from "../Loader";
import ErrorState from "../ErrorState";
import TextDisplay from "../TextDisplay";
import useAnnouncements from "../../hooks/communication/useAnnouncements";
import useCreateAnnouncement from "../../hooks/communication/useCreateAnnouncement";
import useDeleteAnnouncement from "../../hooks/communication/useDeleteAnnouncement";

import styles from "../../styles/components/Announcements.module.css";

export default function Announcements({
  departmentId = null,
  title = "Announcements",
  subtitle = "Share updates with members.",
}) {
  const [announcementTitle, setAnnouncementTitle] = useState("");
  const [message, setMessage] = useState("");

  const {
    announcements,
    loading,
    isError,
    error,
    refresh,
    isFetching,
  } = useAnnouncements({ departmentId });

  const { createAnnouncement, loading: creating } = useCreateAnnouncement();
  const { deleteAnnouncement, loading: deleting } = useDeleteAnnouncement();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createAnnouncement({ title: announcementTitle, message, departmentId });
    setAnnouncementTitle("");
    setMessage("");
  };

  const handleDelete = async (announcementId) => {
    if (!window.confirm("Delete this announcement?")) return;
    await deleteAnnouncement({ announcementId, departmentId });
  };

  /* -------------------------
     LOADING STATE
  -------------------------- */
  if (loading) {
    return (
      <div className={styles.loading}>
        <Loader message="Loading announcements..." fullScreen={false} />
      </div>
    );
  }

  /* -------------------------
     ERROR STATE
  -------------------------- */
  if (isError) {
    return (
      <div className={styles.loading}>
        <ErrorState
          title="Failed to load announcements"
          message={error?.message ?? "Something went wrong while fetching announcements."}
          onRetry={refresh}
        />
      </div>
    );
  }

  /* -------------------------
     MAIN VIEW
  -------------------------- */
  return (
    <section className={styles.page}>
      <header className={styles.header}>
        <div>
          <TextDisplay
            as="h2"
            size="2xl"
            weight="bold"
            color="primary"
          >
            {title}
          </TextDisplay>
          <TextDisplay
            as="p"
            size="md"
            color="muted"
          >
            {subtitle}
          </TextDisplay>
        </div>
        {isFetching && <span className={styles.refreshing}>Updating...</span>}
      </header>

      <div className={styles.grid}>
        {/* New Announcement Form */}
        <Card className={styles.formCard}>
          <TextDisplay
            as="h3"
            size="lg"
            weight="bold"
            color="primary"
          >
            New Announcement
          </TextDisplay>
          <form className={styles.form} onSubmit={handleSubmit}>
            <Input
              label="Title"
              value={announcementTitle}
              onChange={(e) => setAnnouncementTitle(e.target.value)}
            />
            <Input
              label="Message"
              textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <Button type="submit" loading={creating}>
              {creating ? "Publishing..." : "Publish"}
            </Button>
          </form>
        </Card>

        {/* Recent Announcements */}
        <Card className={styles.listCard}>
          <div className={styles.cardHeader}>
            <TextDisplay
              as="h3"
              size="lg"
              weight="bold"
              color="primary"
            >
              Recent Announcements
            </TextDisplay>
            <span className={styles.count}>{announcements.length}</span>
          </div>

          {announcements.length === 0 ? (
            <div className={styles.empty}>
              <p>No announcements available.</p>
            </div>
          ) : (
            <div className={styles.list}>
              {announcements.map((announcement) => (
                <article key={announcement.id} className={styles.item}>
                  <div className={styles.content}>
                    <TextDisplay
                      as="h4"
                      size="md"
                      weight="bold"
                      color="primary"
                    >
                      {announcement.title}
                    </TextDisplay>
                    <TextDisplay as="p" size="sm" color="muted">
                      {announcement.message}
                    </TextDisplay>
                    <TextDisplay as="small" size="sm" color="muted">
                      {new Date(announcement.created_at).toLocaleString()}
                    </TextDisplay>
                  </div>
                  <Button
                    size="sm"
                    variant="danger"
                    loading={deleting}
                    onClick={() => handleDelete(announcement.id)}
                  >
                    Delete
                  </Button>
                </article>
              ))}
            </div>
          )}
        </Card>
      </div>
    </section>
  );
}
