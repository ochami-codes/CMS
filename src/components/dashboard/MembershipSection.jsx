import {
  UserPlus,
  Clock,
  CheckCircle,
  XCircle,
  ArrowRightLeft,
} from "lucide-react";

import Card from "../Card";
import Button from "../Button";
import PageHeader from "../PageHeader";

import styles from "../../styles/dashboard/MembershipSection.module.css";
import { useAuth } from "../../context/AuthContext";
import { useMembershipRequest } from "../../hooks/dashboard/useMembershipRequests";

export default function MembershipSection() {
  const {
    isActiveMember,
    isPendingMember,
    isRejectedMember,
    isTransferred,
  } = useAuth();

  const { requestMembership, isRequesting } = useMembershipRequest();

  /* --------------------------------
     Status Config
  -------------------------------- */
  const statusConfig = {
    active: {
      icon: CheckCircle,
      title: "Member",
      message:
        "Your membership is active. You have full access to ministries.",
      className: styles.active,
    },
    pending: {
      icon: Clock,
      title: "Request Pending",
      message:
        "Your membership request is being reviewed by church admins.",
      className: styles.pending,
    },
    rejected: {
      icon: XCircle,
      title: "Request Declined",
      message:
        "Your previous membership request was declined. You can submit a new request after resolving the issue.",
      className: styles.rejected,
    },
    transferred: {
      icon: ArrowRightLeft,
      title: "Membership Transferred",
      message:
        "Your membership has been transferred from this church.",
      className: styles.none,
    },
    none: {
      icon: UserPlus,
      title: "Join Your Church",
      message:
        "Request membership to access ministries, announcements, and more.",
      className: styles.none,
    },
  };

  /* --------------------------------
     Resolve Current Status
  -------------------------------- */
  const config = isActiveMember
    ? statusConfig.active
    : isRejectedMember
    ? statusConfig.rejected
    : isPendingMember
    ? statusConfig.pending
    : isTransferred
    ? statusConfig.transferred
    : statusConfig.none;

  const Icon = config.icon;

  const showButton =
    !isActiveMember && !isPendingMember && !isTransferred;

  /* --------------------------------
     Render
  -------------------------------- */
  return (
    <section className={styles.section}>
      <PageHeader
        level={3}
        title="Membership"
        icon={<UserPlus size={18} />}
      />

      <Card className={`${styles.card} ${config.className}`}>
        <div className={styles.content}>
          <div className={styles.header}>
            <div className={styles.iconWrap}>
              <Icon size={24} strokeWidth={2.5} />
            </div>
            <div>
              <h4>{config.title}</h4>
              <p className={styles.status}>{config.message}</p>
              <p className={styles.helper}>
                Use the <strong>Church Switcher</strong> in the
                top‑left corner to join or create another church.
              </p>
            </div>
          </div>

          {showButton && (
            <Button
              variant="primary"
              loading={isRequesting}
              onClick={requestMembership}
              className={styles.btn}
            >
              {isRequesting
                ? isRejectedMember
                  ? "Resubmitting..."
                  : "Sending request..."
                : isRejectedMember
                ? "Request Again"
                : "Request Membership"}
            </Button>
          )}
        </div>
      </Card>
    </section>
  );
}
