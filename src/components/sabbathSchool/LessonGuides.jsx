import { useState } from "react";

import Card from "../Card";
import Button from "../Button";
import Loader from "../Loader";
import ResponsiveDataView from "../ResponsiveDataView";
import LessonGuideModal from "./LessonGuideModal";

import useLessonGuides from "../../hooks/sabbathSchool/useLessonGuides";

import styles from "../../styles/components/LessonGuidesPage.module.css";

export default function LessonGuides({
  departmentId,
}) {
  const [showModal, setShowModal] =
    useState(false);

  const {
    subscriptions,
    summary,
    loading,
    error,
    refresh,
  } = useLessonGuides({
    departmentId,
  });
console.log("subscriptions", subscriptions);
console.log("summary", summary);
  const columns = [
    {
      key: "subscriberName",
      label: "Subscriber",
    },
    {
      key: "lessonType",
      label: "Lesson Type",
    },
    {
      key: "quarter",
      label: "Quarter",
    },
    {
      key: "status",
      label: "Status",
    },
    {
      key: "phone",
      label: "Phone"
    },
  ];

  if (loading) {
    return (
      <Card className={styles.state}>
        <Loader
          message="Loading lesson guide subscriptions..."
          fullScreen={false}
        />
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={styles.state}>
        <p>
          Failed to load lesson guide
          subscriptions.
        </p>

        <Button onClick={refresh}>
          Retry
        </Button>
      </Card>
    );
  }

  return (
    <>
      <section className={styles.page}>
        <header className={styles.header}>
          <div>
            <h2 className={styles.title}>
              Lesson Guide Subscriptions
            </h2>

            <p className={styles.subtitle}>
              Track members who have
              subscribed for Sabbath
              School lesson guides and
              prepare quarterly orders.
            </p>
          </div>

          <Button
            onClick={() =>
              setShowModal(true)
            }
          >
            Add Subscription
          </Button>
        </header>

        <div className={styles.summary}>
          <Card>
            <h3>Total Subscribers</h3>
            <strong>
              {summary.totalSubscribers}
            </strong>
          </Card>

          <Card>
            <h3>Current Quarter</h3>
            <strong>
              {summary.currentQuarter}
            </strong>
          </Card>

          <Card>
            <h3>Adult Guides</h3>
            <strong>
              {summary.adultGuides}
            </strong>
          </Card>

          <Card>
            <h3>Youth Guides</h3>
            <strong>
              {summary.youthGuides}
            </strong>
          </Card>
        </div>

        <Card>
          <ResponsiveDataView
            columns={columns}
            data={subscriptions}
          />
        </Card>
      </section>

      <LessonGuideModal
        open={showModal}
        departmentId={departmentId}
        onClose={() =>
          setShowModal(false)
        }
      />
    </>
  );
}