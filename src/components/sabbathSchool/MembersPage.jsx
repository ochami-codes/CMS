import Card from "../Card";
import Loader from "../Loader";
import ResponsiveDataView from "../ResponsiveDataView";
import ErrorState from "../ErrorState";
import useMembers from "../../hooks/members/useMembers";
import TextDisplay from "../TextDisplay";
import styles from "../../styles/components/SabbathSchoolMembersPage.module.css";

export default function MembersPage() {
  const {
    members,
    loading,
    isError,
    error,
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
  error={error}
  title="Failed to load data"
  message={error?.message}
  onRetry={refresh}
/>
      </Card>
    );
  }

  return (
    <section className={styles.page}>
      <header className={styles.header}>
        <TextDisplay as="h2" size="bg">Church Members</TextDisplay>
        <TextDisplay as="p" size="sm" color="info">
          This list is provided as a quick reference for Sabbath School leaders.
          Member records are maintained by the church clerk and cannot be edited here.
        </TextDisplay>
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
