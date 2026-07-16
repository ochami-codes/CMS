import Card from "../Card";
import Loader from "../Loader";
import Button from "../Button";
import ResponsiveDataView from "../ResponsiveDataView";

import styles from "../../styles/components/ChildrenList.module.css";

export default function ChildrenList({
  children = [],
  loading,
  error,
  onRefresh,
}) {
  const columns = [
    {
      key: "full_name",
      label: "Name",
    },
    {
      key: "gender",
      label: "Gender",
    },
    {
      key: "age",
      label: "Age",
    },
    {
      key: "parent_name",
      label: "Parent / Guardian",
    },
    {
      key: "parent_phone",
      label: "Phone",
    },
  ];

  if (loading) {
    return (
      <Card className={styles.loading}>
        <Loader
          message="Loading children..."
          fullScreen={false}
        />
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={styles.loading}>
        <p>
          Failed to load the children
          register.
        </p>

        <Button onClick={onRefresh}>
          Retry
        </Button>
      </Card>
    );
  }

  return (
    <Card className={styles.card}>
      <header className={styles.header}>
        <div>
          <h2 className={styles.title}>
            Registered Children
          </h2>

          <p className={styles.subtitle}>
            These children have been
            registered by the Church Clerk.
          </p>
        </div>

        <span className={styles.count}>
          {children.length}
        </span>
      </header>

      {children.length === 0 ? (
        <div className={styles.empty}>
          <h3>
            No registered children
          </h3>

          <p>
            If a child should appear here,
            kindly request the Church Clerk
            to register them first.
          </p>
        </div>
      ) : (
        <ResponsiveDataView
          columns={columns}
          data={children}
        />
      )}
    </Card>
  );
}