import Card from "../Card";
import Button from "../Button";
import styles from "../../styles/components/MemberProfile.module.css";

export default function MemberProfileCard({
  member,
  onClose,
  onEdit,
}) {
  if (!member) return null;

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("en-KE", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatBaptized = (value) => {
    if (value === true) return "Yes";
    if (value === false) return "No";
    return "-";
  };

  return (
    <div className={styles.overlay}>
      <Card className={styles.modal}>
        {/* Header */}
        <div className={styles.header}>
          <div>
            <h2 className={styles.name}>
              {member.full_name}
            </h2>

            <p className={styles.sub}>
              {member.status}
            </p>
          </div>

          <button
            className={styles.close}
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        {/* Basic Info */}
        <div className={styles.section}>
          <h3>Basic Information</h3>

          <div className={styles.grid}>
            <div>
              <span>Phone:</span> {member.phone || "-"}
            </div>

            <div>
              <span>Email:</span> {member.email || "-"}
            </div>

            <div>
              <span>Marital Status:</span>{" "}
              {member.marital_status || "-"}
            </div>

            <div>
              <span>Joined:</span>{" "}
              {formatDate(member.joined_at)}
            </div>

            <div>
              <span>Created:</span>{" "}
              {formatDate(member.created_at)}
            </div>

            <div>
              <span>System User:</span>{" "}
              {member.is_system_user ? "Yes" : "No"}
            </div>
          </div>
        </div>

        {/* Church Info */}
        <div className={styles.section}>
          <h3>Church Details</h3>

          <div className={styles.grid}>
            <div>
              <span>Baptized:</span>{" "}
              {formatBaptized(member.baptized)}
            </div>

            <div>
              <span>Baptism Date:</span>{" "}
              {formatDate(member.baptismal_date)}
            </div>

            <div>
              <span>Membership Type:</span>{" "}
              {member.membership_type || "-"}
            </div>

            <div>
              <span>Status:</span>{" "}
              {member.status || "-"}
            </div>
          </div>
        </div>

        {/* Emergency Contact */}
        <div className={styles.section}>
          <h3>Emergency Contact</h3>

          <div className={styles.grid}>
            <div>
              <span>Name:</span>{" "}
              {member.emergency_contact_name || "-"}
            </div>

            <div>
              <span>Phone:</span>{" "}
              {member.emergency_contact_phone || "-"}
            </div>

            <div>
              <span>Relationship:</span>{" "}
              {member.emergency_contact_relationship || "-"}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className={styles.actions}>
          <Button
            variant="secondary"
            onClick={onEdit}
          >
            Edit
          </Button>

          <Button
            variant="danger"
            onClick={onClose}
          >
            Close
          </Button>
        </div>
      </Card>
    </div>
  );
}