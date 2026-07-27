import Card from "../Card";
import Loader from "../Loader";
import ResponsiveDataView from "../ResponsiveDataView";
import ErrorState from "../ErrorState";
import useMembers from "../../hooks/members/useMembers";

import styles from "../../styles/components/SabbathSchoolMembersPage.module.css";

export default function MembersPage() {
  const {
    members,
    loading,
    isError,
    refresh,
  } = useMembers();

  const columns = [
    { key: "full_name", label: "Name" },
    { key: "phone", label: "Phone" },
    { key: "gender", label: "Gender" },
  ];

  if (loading) {
    return (
      <Card className={styles.state}>
        <Loader message="Loading members..." fullScreen={false} />
      </Card>
    );
  }

  if (isError) {
    return (
      <Card className={styles.state}>
        <ErrorState
          message="Failed to load members."
          onRetry={refresh}
        />
      </Card>
    );
  }

  return (
    <section className={styles.page}>
      <header className={styles.header}>
        <h2 className={styles.title}>Church Members</h2>
        <p className={styles.subtitle}>
          This list is provided as a quick reference for Sabbath School leaders.
          Member records are maintained by the church clerk and cannot be edited here.
        </p>
      </header>

      <Card>
        <ResponsiveDataView
          columns={columns}
          data={members}
        />
      </Card>
    </section>
  );
}
