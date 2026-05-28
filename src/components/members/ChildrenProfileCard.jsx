import Card from "../Card";
import Button from "../Button";
import styles from "../../styles/components/ChildrenProfile.module.css";

export default function ChildrenProfileCard({
  child,
  onClose,
  onEdit,
}) {
  if (!child) return null;

  const calculateAge = (dob) => {
    if (!dob) return "-";
    const diff = new Date() - new Date(dob);
    return Math.floor(diff / (1000 * 60 * 60 * 24 * 365));
  };

  return (
    <div className={styles.overlay}>
      <Card className={styles.modal}>

        {/* Header */}
        <div className={styles.header}>
          <div>
            <h2 className={styles.name}>
              {child.name}
            </h2>

            <p className={styles.sub}>
              {calculateAge(child.dob)} years • {child.gender}
            </p>
          </div>

          <button
            className={styles.close}
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        {/* Child Info */}
        <div className={styles.section}>
          <h3>Child Information</h3>

          <div className={styles.grid}>
            <div>
              <span>DOB:</span> {child.dob}
            </div>

            <div>
              <span>Age:</span> {calculateAge(child.dob)}
            </div>

            <div>
              <span>Gender:</span> {child.gender}
            </div>
          </div>
        </div>

        {/* Guardian Info (MOST IMPORTANT) */}
        <div className={styles.section}>
          <h3>Guardian Information</h3>

          <div className={styles.grid}>
            <div>
              <span>Name:</span> {child.parent_name}
            </div>

            <div>
              <span>Phone:</span> {child.parent_phone}
            </div>

            <div>
              <span>Relationship:</span> {child.relationship || "-"}
            </div>
          </div>
        </div>

        {/* Optional Church Info */}
        <div className={styles.section}>
          <h3>Sabbath School</h3>

          <div className={styles.grid}>
            <div>
              <span>Class:</span> {child.class || "Not assigned"}
            </div>

            <div>
              <span>Status:</span> {child.status || "Active"}
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
