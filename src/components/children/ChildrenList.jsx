// src/components/children/ChildrenList.jsx

import Card from "../Card";
import Loader from "../Loader";
import Button from "../Button";
import ResponsiveDataView from "../ResponsiveDataView";
import ErrorState from "../ErrorState";
import TextDisplay from "../TextDisplay";
import styles from "../../styles/components/ChildrenList.module.css";

export default function ChildrenList({
  children = [],
  loading,
  error,
  isError,
  onRefresh,
}) {
  const columns = [
    { key: "full_name", label: "Name" },
    { key: "gender", label: "Gender" },
    { key: "age", label: "Age" },
    { key: "parent_name", label: "Parent / Guardian" },
    { key: "parent_phone", label: "Phone" },
  ];

  // Loading state
  if (loading) {
    return (
      <Card className={styles.loading}>
        <Loader message="Loading children..." fullScreen={false} />
      </Card>
    );
  }

  // Error state
  if (isError) {
    return (
      <Card className={styles.loading}>
        <ErrorState
  error={error}
  title="Failed to load data"
  message={error?.message}
  onRetry={onRefresh}
/>
      </Card>
    );
  }

  // Main content
  return (
    <Card className={styles.card}>
      <header className={styles.header}>
        <div>
          <TextDisplay
            as="h2"
            size="xl"
            weight="bold"
            color="primary"
          >
            Registered Children
          </TextDisplay>
          <TextDisplay as="p" size="md" color="muted">
            These children have been registered by the Church Clerk.
          </TextDisplay>
        </div>
        <span className={styles.count}>{children.length}</span>
      </header>

      {children.length === 0 ? (
        <div className={styles.empty}>
          <TextDisplay as="p" size="sm" color="muted">
            No registered children
          </TextDisplay>
          <TextDisplay as="p" size="sm" color="warning">
            If a child should appear here, kindly request the Church Clerk to register them first.
          </TextDisplay>
        </div>
      ) : (
        <ResponsiveDataView columns={columns} data={children} />
      )}
    </Card>
  );
}
