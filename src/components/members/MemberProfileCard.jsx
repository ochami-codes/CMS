import Card from "../Card";
import Button from "../Button";
import styles from "../../styles/components/MemberProfile.module.css";

export default function MemberProfileCard({
  member,
  onClose,
  onEdit,
}) {
  if (!member) return null;

  return (
    <div className={styles.overlay}>
      <Card className={styles.modal}>
        
        {/* Header */}
        <div className={styles.header}>
          <div>
            <h2 className={styles.name}>
              {member.name}
            </h2>
            <p className={styles.sub}>
              {member.role} • {member.status}
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
            <div><span>Phone:</span> {member.phone}</div>
            <div><span>Email:</span> {member.email || "-"}</div>
            <div><span>Gender:</span> {member.gender}</div>
            <div><span>DOB:</span> {member.dob || "-"}</div>
            <div><span>Marital:</span> {member.maritalStatus || "-"}</div>
          </div>
        </div>

        {/* Church Info */}
        <div className={styles.section}>
          <h3>Church Details</h3>

          <div className={styles.grid}>
            <div>
              <span>Baptized:</span>{" "}
              {member.baptized ? "Yes" : "No"}
            </div>

            <div>
              <span>Date:</span>{" "}
              {member.dateOfBaptism || "-"}
            </div>

            <div>
              <span>Type:</span> {member.membershipType}
            </div>

            <div>
              <span>Status:</span> {member.status}
            </div>
          </div>
        </div>

        {/* Emergency Contact */}
        <div className={styles.section}>
          <h3>Emergency Contact</h3>

          <div className={styles.grid}>
            <div>
              <span>Name:</span>{" "}
              {member.emergencyContact?.name || "-"}
            </div>

            <div>
              <span>Phone:</span>{" "}
              {member.emergencyContact?.phone || "-"}
            </div>

            <div>
              <span>Relationship:</span>{" "}
              {member.emergencyContact?.relationship || "-"}
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
