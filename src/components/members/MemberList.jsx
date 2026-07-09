import Button from "../Button";
import Card from "../Card";
import Loader from "../Loader";
import ResponsiveDataView from "../ResponsiveDataView";

import useDepartmentMembers from "../../hooks/members/useDepartmentMembers";
import useDeleteMember from "../../hooks/members/useDeleteMember";

import styles from "../../styles/components/MemberList.module.css";

export default function MemberList({
  departmentId,
  title = "Members",
  subtitle = "Registered members in this department.",
}) {
  const {
  members,
  loading,
  error,
  refresh,
} = useDepartmentMembers(departmentId);
  const {
    deleteMember,
    loading: deleting,
  } = useDeleteMember();

  const columns = [
    {
      key: "full_name",
      label: "Name",
    },
    {
      key: "phone",
      label: "Phone",
    },
    {
      key: "gender",
      label: "Gender",
    },
  ];

  const handleDelete = async (memberId) => {
    if (
      !window.confirm(
        "Delete this member from the department?"
      )
    ) {
      return;
    }

    await deleteMember({
  memberId,
  departmentId,
});
  };

  if (loading) {
    return (
      <Card className={styles.loading}>
        <Loader message="Loading members..."
        fullScreen={false} />
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={styles.loading}>
        <p>
          Failed to load members.
        </p>

        <Button onClick={refresh}>
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
            {title}
          </h2>

          <p className={styles.subtitle}>
            {subtitle}
          </p>
        </div>

        <span className={styles.count}>
          {members.length}
        </span>
      </header>

      <ResponsiveDataView
        columns={columns}
        data={members}
        renderActions={(member) => (
          <Button
  size="sm"
  variant="danger"
  disabled={deleting}
  onClick={() =>
    handleDelete(member.id)
  }
>
  Remove
</Button>
        )}
      />
    </Card>
  );
}
