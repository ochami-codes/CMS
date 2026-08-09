import Card from "../Card";
import Button from "../Button";
import styles from "../../styles/components/TransferDetails.module.css";
import { formatDateTime } from "../../utils/formatDate";

export default function TransferDetailsCard({
  transfer,
  type = "in",
  onClose,
  onOpenApproveModal,
  onOpenRejectModal,
}) {
  if (!transfer) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <Card className={styles.modal} onClick={(e) => e.stopPropagation()}>

        {/* Header */}
        <div className={styles.header}>
          <div>
            <h2 className={styles.title}>
              {transfer.member_name}
            </h2>

            <p className={styles.subtitle}>
              Transfer {type === "in" ? "In" : "Out"} • {transfer.status}
            </p>
          </div>

          <button className={styles.close} onClick={onClose}>
            ✕
          </button>
        </div>

        {/* Route */}
        <div className={styles.section}>
          <h3>Transfer Route</h3>

          <div className={styles.route}>
            <div className={styles.routeBox}>
              <span>From</span>
              <strong>{transfer.source_church_name || "-"}</strong>
            </div>

            <div className={styles.arrow}>→</div>

            <div className={styles.routeBox}>
              <span>To</span>
              <strong>{transfer.destination_church_name ||transfer.external_church_name|| "-"}</strong>
            </div>
          </div>
        </div>

        {/* Info */}
        <div className={styles.section}>
          <h3>Member Details</h3>

          <div className={styles.grid}>
            <div className={styles.item}>
              <span>Date Requested</span>
              <p>{formatDateTime(transfer.created_at)}</p>
            </div>

            <div className={styles.item}>
              <span>Phone</span>
              <p>{transfer.phone || "-"}</p>
            </div>

            <div className={styles.item}>
              <span>Status</span>
              <p className={`${styles.status} ${styles[transfer.status]}`}>
                {transfer.status}
              </p>
            </div>
          </div>
        </div>

        {/* Reason */}
        <div className={styles.section}>
          <h3>Reason</h3>

          <div className={styles.reason}>
            {transfer.reason || "No reason provided"}
          </div>
        </div>

        {/* Timeline */}
        <div className={styles.section}>
          <h3>Timeline</h3>

          <div className={styles.timeline}>
            <div className={styles.timelineItem}>
              <div className={styles.dot} />
              <div>
                <strong>Request Submitted</strong>
                <p>{formatDateTime(transfer.created_at)}</p>
              </div>
            </div>

            <div className={styles.timelineItem}>
              <div className={styles.dotMuted} />
              <div>
                <strong>Pending Review</strong>
                <p>Awaiting clerk/pastor action</p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className={styles.actions}>
          <Button variant="secondary" onClick={onOpenApproveModal}>
            Approve
          </Button>

          <Button variant="danger" onClick={onOpenRejectModal}>
            Reject
          </Button>

          <Button variant="ghost" onClick={onClose}>
            Close
          </Button>
        </div>

      </Card>
    </div>
  );
}
