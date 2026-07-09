import { useState } from "react";

import Card from "../Card";
import Input from "../Input";
import Button from "../Button";
import Loader from "../Loader";

import useAnnouncements from "../../hooks/communication/useAnnouncements";
import useCreateAnnouncement from "../../hooks/communication/useCreateAnnouncement";
import useDeleteAnnouncement from "../../hooks/communication/useDeleteAnnouncement";

import styles from "../../styles/components/Announcements.module.css";

export default function Announcements({
  departmentId = null,
  title = "Announcements",
  subtitle = "Share updates with members.",
}) {
  const [announcementTitle, setAnnouncementTitle] =
    useState("");

  const [message, setMessage] =
    useState("");

  const {
    announcements,
    loading,
    error,
    refresh,
    isFetching,
  } = useAnnouncements({
    departmentId,
  });

  const {
    createAnnouncement,
    loading: creating,
  } = useCreateAnnouncement();

  const {
    deleteAnnouncement,
    loading: deleting,
  } = useDeleteAnnouncement();
console.log("announcements", announcements);
  const handleSubmit = async (e) => {
    e.preventDefault();

    await createAnnouncement({
      title: announcementTitle,
      message,
      departmentId,
    });

    setAnnouncementTitle("");
    setMessage("");
  };

  const handleDelete = async (id) => {
    if (
      !window.confirm(
        "Delete this announcement?"
      )
    ) {
      return;
    }

    await deleteAnnouncement(id);
  };

  if (loading) {
    return (
      <div className={styles.loading}>
        <Loader message="Loading announcements..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.loading}>
        <p>
          Failed to load announcements.
        </p>

        <Button onClick={refresh}>
          Retry
        </Button>
      </div>
    );
  }

  return (
    <section className={styles.page}>
      <header className={styles.header}>
        <div>
          <h2 className={styles.title}>
            {title}
          </h2>

          <p className={styles.subtitle}>
            {subtitle}
          </p>
        </div>

        {isFetching && (
          <span className={styles.refreshing}>
            Updating...
          </span>
        )}
      </header>

      <div className={styles.grid}>
        <Card className={styles.formCard}>
          <h3 className={styles.cardTitle}>
            New Announcement
          </h3>

          <form
            className={styles.form}
            onSubmit={handleSubmit}
          >
            <Input
              label="Title"
              value={announcementTitle}
              onChange={(e) =>
                setAnnouncementTitle(
                  e.target.value
                )
              }
            />

            <Input
              label="Message"
              textarea
              value={message}
              onChange={(e) =>
                setMessage(
                  e.target.value
                )
              }
            />

            <Button
              type="submit"
              disabled={creating}
            >
              {creating
                ? "Publishing..."
                : "Publish"}
            </Button>
          </form>
        </Card>

        <Card className={styles.listCard}>
          <div className={styles.cardHeader}>
            <h3 className={styles.cardTitle}>
              Recent Announcements
            </h3>

            <span className={styles.count}>
              {announcements.length}
            </span>
          </div>

          {announcements.length ===
          0 ? (
            <div className={styles.empty}>
              <p>
                No announcements
                available.
              </p>
            </div>
          ) : (
            <div className={styles.list}>
              {announcements.map(
                (announcement) => (
                  <article
                    key={
                      announcement.id
                    }
                    className={
                      styles.item
                    }
                  >
                    <div
                      className={
                        styles.content
                      }
                    >
                      <h4>
                        {
                          announcement.title
                        }
                      </h4>

                      <p>
                        {
                          announcement.message
                        }
                      </p>

                      <small>
                        {new Date(
                          announcement.created_at
                        ).toLocaleString()}
                      </small>
                    </div>

                    <Button
                      size="sm"
                      variant="danger"
                      disabled={
                        deleting
                      }
                      onClick={() =>
                        handleDelete(
                          announcement.id
                        )
                      }
                    >
                      Delete
                    </Button>
                  </article>
                )
              )}
            </div>
          )}
        </Card>
      </div>
    </section>
  );
}