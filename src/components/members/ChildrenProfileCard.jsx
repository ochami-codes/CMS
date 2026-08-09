import Card from "../Card";
import Button from "../Button";
import styles from "../../styles/components/ChildrenProfile.module.css";
import { formatDate } from "../../utils/formatDate";
export default function ChildrenProfileCard({
  child,
  onClose,
  onEdit,
}) {
  if (!child) return null;

  const calculateAge = (dob) => {
    if (!dob) return "-";
    const diff = new Date() - new Date(dob);
    return Math.floor(
      diff / (1000 * 60 * 60 * 24 * 365)
    );
  };

  return (
    <div
      className={styles.overlay}
      onClick={onClose}
    >
      <Card
        className={styles.modal}
        onClick={(e) =>
          e.stopPropagation()
        }
      >

        {/* HEADER */}
        <div className={styles.header}>
          <div>
            <h2 className={styles.name}>
              {child.full_name ||
                "Child Name"}
            </h2>

            <p className={styles.sub}>
              {calculateAge(
                child.date_of_birth
              )}{" "}
              years •{" "}
              {child.gender || "Not set"}
            </p>
          </div>

          <button
            className={styles.close}
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        {/* CHILD INFO */}
        <div className={styles.section}>
          <h3>
            Child Information
          </h3>

          <div className={styles.grid}>
            <div className={styles.item}>
              <span className={styles.label}>
                Full Name
              </span>
              <span className={styles.value}>
                {child.full_name || "-"}
              </span>
            </div>

            <div className={styles.item}>
              <span className={styles.label}>
                Date of Birth
              </span>
              <span className={styles.value}>
                { formatDate(child.date_of_birth) ||
                  "Not recorded"}
              </span>
            </div>

            <div className={styles.item}>
              <span className={styles.label}>
                Age
              </span>
              <span className={styles.value}>
                {calculateAge(
                  child.date_of_birth
                )}
              </span>
            </div>

            <div className={styles.item}>
              <span className={styles.label}>
                Gender
              </span>
              <span className={styles.value}>
                {child.gender || "-"}
              </span>
            </div>
             <div className={styles.item}>
              <span className={styles.label}>
                Dedication
              </span>
              <span className={styles.value}>
                {child.dedication || "-"}
              </span>
            </div>
             <div className={styles.item}>
              <span className={styles.label}>
                Dedication Date
              </span>
              <span className={styles.value}>
                {formatDate(child.dedication_date) || "-"}
              </span>
            </div>
          </div>
        </div>

        {/* GUARDIAN */}
        <div className={styles.section}>
          <h3>
            Parent / Guardian
          </h3>

          <div className={styles.grid}>
            <div className={styles.item}>
              <span className={styles.label}>
                Name
              </span>
              <span className={styles.value}>
                {child.parent_name ||
                  "Not assigned"}
              </span>
            </div>

            <div className={styles.item}>
              <span className={styles.label}>
                Phone
              </span>
              <span className={styles.value}>
                {child.parent_phone ||
                  "Not available"}
              </span>
            </div>
          </div>
        </div>
        {/* ACTIONS */}
        <div className={styles.actions}>
          <Button
            variant="secondary"
            onClick={onEdit}
          >
            Edit Details
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