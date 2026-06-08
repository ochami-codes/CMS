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
    <div className={styles.overlay} onClick={onClose}>
      <Card className={styles.modal} onClick={(e) => e.stopPropagation()}>

        {/* HEADER */}
        <div className={styles.header}>
          <div>
            <h2 className={styles.name}>
              {member.full_name}
            </h2>

            <p className={styles.sub}>
              {member.status}
            </p>
          </div>

          <button className={styles.close} onClick={onClose}>
            ✕
          </button>
        </div>

        {/* BASIC INFO */}
        <div className={styles.section}>
          <h3>Basic Information</h3>

          <div className={styles.grid}>
            <div className={styles.item}>
              <span className={styles.label}>Phone</span>
              <span className={styles.value}>{member.phone || "-"}</span>
            </div>

            <div className={styles.item}>
              <span className={styles.label}>Email</span>
              <span className={styles.value}>{member.email || "-"}</span>
            </div>

            <div className={styles.item}>
              <span className={styles.label}>Marital Status</span>
              <span className={styles.value}>
                {member.marital_status || "-"}
              </span>
            </div>

            <div className={styles.item}>
              <span className={styles.label}>Joined</span>
              <span className={styles.value}>
                {formatDate(member.joined_at)}
              </span>
            </div>

            <div className={styles.item}>
              <span className={styles.label}>Created</span>
              <span className={styles.value}>
                {formatDate(member.created_at)}
              </span>
            </div>

            <div className={styles.item}>
              <span className={styles.label}>System User</span>
              <span className={styles.value}>
                {member.is_system_user ? "Yes" : "No"}
              </span>
            </div>
          </div>
        </div>

        {/* CHURCH INFO */}
        <div className={styles.section}>
          <h3>Church Details</h3>

          <div className={styles.grid}>
            <div className={styles.item}>
              <span className={styles.label}>Baptized</span>
              <span className={styles.value}>
                {formatBaptized(member.baptized)}
              </span>
            </div>

            <div className={styles.item}>
              <span className={styles.label}>Baptism Date</span>
              <span className={styles.value}>
                {formatDate(member.baptismal_date)}
              </span>
            </div>

            <div className={styles.item}>
              <span className={styles.label}>Membership Type</span>
              <span className={styles.value}>
                {member.membership_type || "-"}
              </span>
            </div>

            <div className={styles.item}>
              <span className={styles.label}>Status</span>
              <span
                className={`${styles.badge} ${
                  styles[member.status?.toLowerCase()]
                }`}
              >
                {member.status || "-"}
              </span>
            </div>
          </div>
        </div>

        {/* EMERGENCY */}
        <div className={styles.section}>
          <h3>Emergency Contact</h3>

          <div className={styles.grid}>
            <div className={styles.item}>
              <span className={styles.label}>Name</span>
              <span className={styles.value}>
                {member.emergency_contact_name || "-"}
              </span>
            </div>

            <div className={styles.item}>
              <span className={styles.label}>Phone</span>
              <span className={styles.value}>
                {member.emergency_contact_phone || "-"}
              </span>
            </div>

            <div className={styles.item}>
              <span className={styles.label}>Relationship</span>
              <span className={styles.value}>
                {member.emergency_contact_relationship || "-"}
              </span>
            </div>
          </div>
        </div>

        {/* ACTIONS */}
        <div className={styles.actions}>
          <Button variant="secondary" onClick={onEdit}>
            Edit
          </Button>

          <Button variant="danger" onClick={onClose}>
            Close
          </Button>
        </div>

      </Card>
    </div>
  );
}