import Button from "../Button";
import Card from "../Card";
import Loader from "../Loader";
import ResponsiveDataView from "../ResponsiveDataView";
import ErrorState from "../ErrorState";
import useDepartmentMembers from "../../hooks/members/useDepartmentMembers";
import useDeleteMember from "../../hooks/members/useDeleteMember";
import TextDisplay from "../TextDisplay";
import styles from "../../styles/components/MemberList.module.css";

export default function MemberList({
  departmentId,
  title = "Members",
  subtitle = "Registered members in this department.",
}) {
  const {
    members,
    loading,
    refresh,
    isError,
    error,
  } = useDepartmentMembers(departmentId);

  const { deleteMember, isDeleting } = useDeleteMember();

  const columns = [
    { key: "full_name", label: "Name" },
    { key: "phone", label: "Phone" },
    { key: "gender", label: "Gender" },
  ];

  const handleDelete = async (memberId) => {
    if (!window.confirm("Delete this member from the department?")) {
      return;
    }

    await deleteMember({ memberId, departmentId });
  };

  if (loading) {
    return (
      <Card className={styles.loading}>
        <Loader message="Loading members..." fullScreen={false} />
      </Card>
    );
  }

  if (isError) {
    return (
      <Card className={styles.loading}>
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
    <Card className={styles.card}>
      <header className={styles.header}>
        <div>
          <TextDisplay
            as="h2"
            size="xl"
            weight="bold"
            color="primary"
          >
            {title}
          </TextDisplay>
          <TextDisplay as="p" size="md" color="muted">
            {subtitle}
          </TextDisplay>
        </div>
        <span className={styles.count}>{members.length}</span>
      </header>

      <ResponsiveDataView
        columns={columns}
        data={members}
        renderActions={(member) => (
          <Button
            size="sm"
            variant="danger"
            loading={isDeleting(member.id)}
            onClick={() => handleDelete(member.id)}
          >
            Remove
          </Button>
        )}
      />
    </Card>
  );
}

