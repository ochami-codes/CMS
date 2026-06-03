import Card from "../Card";
import Button from "../Button";
import styles from "../../styles/components/TransferDetails.module.css";

export default function TransferDetailsCard({
  transfer,
  type = "in",
  onClose,
  onApprove,
  onReject,
}) {
  if (!transfer) return null;

  return (
    <div className={styles.overlay}>
      <Card className={styles.modal}>

        {/* Header */}
        <div className={styles.header}>
          <div>
            <h2 className={styles.name}>
              {transfer.name}
            </h2>

            <p className={styles.sub}>
              Transfer {type === "in" ? "In" : "Out"}
            </p>
          </div>

          <button
            className={styles.close}
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        {/* Transfer Route */}
        <div className={styles.section}>
          <h3>Transfer Route</h3>

          <div className={styles.route}>
            <div className={styles.routeCard}>
              <span>From</span>
              <strong>
                {transfer.from || "-"}
              </strong>
            </div>

            <div className={styles.arrow}>
              →
            </div>

            <div className={styles.routeCard}>
              <span>To</span>
              <strong>
                {transfer.to || "-"}
              </strong>
            </div>
          </div>
        </div>

        {/* Member Information */}
        <div className={styles.section}>
          <h3>Member Information</h3>

          <div className={styles.grid}>
            <div>
              <span>Status:</span>
              <p>{transfer.status}</p>
            </div>

            <div>
              <span>Date Requested:</span>
              <p>{transfer.date}</p>
            </div>

            <div>
              <span>Role:</span>
              <p>{transfer.role || "Member"}</p>
            </div>

            <div>
              <span>Phone:</span>
              <p>{transfer.phone || "-"}</p>
            </div>
          </div>
        </div>

        {/* Reason */}
        <div className={styles.section}>
          <h3>Transfer Reason</h3>

          <div className={styles.reason}>
            {transfer.reason ||
              "No reason provided."}
          </div>
        </div>

        {/* Timeline */}
        <div className={styles.section}>
          <h3>Transfer Timeline</h3>

          <div className={styles.timeline}>
            <div className={styles.timelineItem}>
              <div className={styles.dot} />
              <div>
                <strong>Request Submitted</strong>
                <p>{transfer.date}</p>
              </div>
            </div>

            <div className={styles.timelineItem}>
              <div className={styles.dotMuted} />
              <div>
                <strong>Awaiting Approval</strong>
                <p>
                  Clerk/Pastor review pending
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className={styles.actions}>
          <Button
            variant="secondary"
            onClick={onApprove}
          >
            Approve
          </Button>

          <Button
            variant="danger"
            onClick={onReject}
          >
            Reject
          </Button>

          <Button
            variant="ghost"
            onClick={onClose}
          >
            Close
          </Button>
        </div>

      </Card>
    </div>
  );
}
