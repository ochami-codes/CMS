import { useState } from "react";

import Card from "../Card";
import Input from "../Input";
import Button from "../Button";
import Loader from "../Loader";
import ErrorState from "../ErrorState";
import TextDisplay from "../TextDisplay";

import useChurchAnnouncements from "../../hooks/communication/useChurchAnnouncement";
import useDepartmentAnnouncements from "../../hooks/communication/useDepartmentAnnouncement";
import useCreateChurchAnnouncement from "../../hooks/communication/useCreateChurchAnnouncement";
import useCreateDepartmentAnnouncement from "../../hooks/communication/useCreateDepartmentAnnouncement";
import useDeleteChurchAnnouncement from "../../hooks/communication/useDeleteChurchAnnouncement";
import useDeleteDepartmentAnnouncement from "../../hooks/communication/useDeleteDepartmentAnnouncement";

import styles from "../../styles/components/Announcements.module.css";

export default function Announcements({
  departmentId = null,
  title = "Announcements",
  subtitle = "Share updates with members.",
}) {
  console.log("id", departmentId);
  if (departmentId) {
    return (
      <DepartmentAnnouncements
        departmentId={departmentId}
        title={title}
        subtitle={subtitle}
      />
    );
  }

  return (
    <ChurchAnnouncements
      title={title}
      subtitle={subtitle}
    />
  );
}
 //  SHARED UI
function AnnouncementView({
  title,
  subtitle,
  announcements,
  loading,
  error,
  refresh,
  isFetching,
  creating,
  announcementTitle,
  message,
  setAnnouncementTitle,
  setMessage,
  handleSubmit,
  handleDelete,
  deletingId,
}) {
  if (loading) {
    return <Loader message="Loading..." fullScreen={false} />;
  }

  if (error) {
    return (
    <ErrorState
  error={error}
  title="Failed to load data"
  message={error?.message}
  onRetry={refresh}
/>
    );
  }

  return (
    <section>
      <TextDisplay as="h2" size="xl" weight="bold" color="primary">
        {title}
      </TextDisplay>

      <TextDisplay as="p" size="sm" color="muted">
        {subtitle}
      </TextDisplay>

      {isFetching && (
        <TextDisplay size="sm" color="muted">
          Updating...
        </TextDisplay>
      )}

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

          <form
            className={styles.form}
            onSubmit={handleSubmit}
          >
            <Input
              label="Title"
              value={announcementTitle}
              onChange={(e) =>
                setAnnouncementTitle(e.target.value)
              }
            />

            <Input
              label="Message"
              textarea
              value={message}
              onChange={(e) =>
                setMessage(e.target.value)
              }
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

            <span className={styles.count}>
              {announcements.length}
            </span>
          </div>

          {announcements.length === 0 ? (
            <div className={styles.empty}>
              <p>No announcements available.</p>
            </div>
          ) : (
            <div className={styles.list}>
              {announcements.map((announcement) => (
                <article
                  key={announcement.id}
                  className={styles.item}
                >
                  <div className={styles.content}>
                    <TextDisplay
                      as="h4"
                      size="md"
                      weight="bold"
                      color="primary"
                    >
                      {announcement.title}
                    </TextDisplay>

                    <TextDisplay
                      as="p"
                      size="sm"
                      color="muted"
                    >
                      {announcement.message}
                    </TextDisplay>

                    <TextDisplay
                      as="small"
                      size="sm"
                      color="muted"
                    >
                      {new Date(
                        announcement.created_at
                      ).toLocaleString()}
                    </TextDisplay>
                  </div>

                  <Button
                    size="sm"
                    variant="danger"
                    loading={
                      deletingId === announcement.id
                    }
                    onClick={() =>
                      handleDelete(announcement.id)
                    }
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
  // CHURCH ANNOUNCEMENTS
function ChurchAnnouncements({ title, subtitle }) {
  const [announcementTitle, setAnnouncementTitle] =
    useState("");
  const [message, setMessage] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  const {
    announcements = [],
    loading,
    error,
    refresh,
    isFetching,
  } = useChurchAnnouncements();

  const {
    createChurchAnnouncement,
    loading: creating,
  } = useCreateChurchAnnouncement();

  const {
    deleteChurchAnnouncement,
  } = useDeleteChurchAnnouncement();

  const handleSubmit = async (e) => {
    e.preventDefault();

    await createChurchAnnouncement({
      title: announcementTitle,
      message,
    });

    setAnnouncementTitle("");
    setMessage("");
  };

  const handleDelete = async (announcementId) => {
    if (!window.confirm("Delete this announcement?")) {
      return;
    }

    setDeletingId(announcementId);

    try {
      await deleteChurchAnnouncement(announcementId);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <AnnouncementView
      title={title}
      subtitle={subtitle}
      announcements={announcements}
      loading={loading}
      error={error}
      refresh={refresh}
      isFetching={isFetching}
      creating={creating}
      announcementTitle={announcementTitle}
      message={message}
      setAnnouncementTitle={setAnnouncementTitle}
      setMessage={setMessage}
      handleSubmit={handleSubmit}
      handleDelete={handleDelete}
      deletingId={deletingId}
    />
  );
}
 //  DEPARTMENT ANNOUNCEMENTS
function DepartmentAnnouncements({
  departmentId,
  title,
  subtitle,
}) {
  const [announcementTitle, setAnnouncementTitle] =
    useState("");
  const [message, setMessage] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  const {
    announcements = [],
    loading,
    error,
    refresh,
    isFetching,
  } = useDepartmentAnnouncements({departmentId});

  const {
    createDepartmentAnnouncement,
    loading: creating,
  } = useCreateDepartmentAnnouncement();

  const {
    deleteDepartmentAnnouncement,
  } = useDeleteDepartmentAnnouncement();

  const handleSubmit = async (e) => {
    e.preventDefault();

    await createDepartmentAnnouncement({
      departmentId,
      title: announcementTitle,
      message,
    });

    setAnnouncementTitle("");
    setMessage("");
  };

  const handleDelete = async (announcementId) => {
    if (!window.confirm("Delete this announcement?")) {
      return;
    }

    setDeletingId(announcementId);

    try {
      await deleteDepartmentAnnouncement({
        departmentId,
        announcementId,
      });
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <AnnouncementView
      title={title}
      subtitle={subtitle}
      announcements={announcements}
      loading={loading}
      error={error}
      refresh={refresh}
      isFetching={isFetching}
      creating={creating}
      announcementTitle={announcementTitle}
      message={message}
      setAnnouncementTitle={setAnnouncementTitle}
      setMessage={setMessage}
      handleSubmit={handleSubmit}
      handleDelete={handleDelete}
      deletingId={deletingId}
    />
  );
}