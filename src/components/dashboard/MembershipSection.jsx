import { useState } from "react";
import { UserPlus, Clock, CheckCircle, XCircle } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { MembershipAPI } from "../../utils/api";
import Card from "../Card";
import Button from "../Button";
import PageHeader from "../PageHeader";
import styles from "../../styles/dashboard/MembershipSection.module.css";

export default function MembershipSection() {
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const { activeMembershipStatus, refetchUser } = useAuth();

  const handleRequestMembership = async () => {
    try {
      setLoading(true);
      setSuccessMessage("");
      setErrorMessage("");
      await MembershipAPI.submit({});
      await refetchUser();
      setSuccessMessage("Membership request submitted 🙏");
    } catch (err) {
      setErrorMessage(err?.response?.data?.message || "Request failed");
    } finally {
      setLoading(false);
    }
  };

  const statusConfig = {
    requested: {
      icon: Clock,
      title: "Request Pending",
      message: "Your membership request is being reviewed by church admins.",
      className: styles.pending,
    },
    active: {
      icon: CheckCircle,
      title: "Member",
      message: "Your membership is active. You have full access to ministries.",
      className: styles.active,
    },
    rejected: {
      icon: XCircle,
      title: "Request Declined",
      message: "Your membership request was declined. Contact the church office for details.",
      className: styles.rejected,
    },
    none: {
      icon: UserPlus,
      title: "Join Your Church",
      message: "Request membership to access ministries, announcements, and more.",
      className: styles.none,
    },
  };

  const config = statusConfig[activeMembershipStatus] || statusConfig.none;
  const Icon = config.icon;
  const showButton = activeMembershipStatus!== "requested" && activeMembershipStatus!== "active";

  return (
    <section className={styles.section}>
      <PageHeader level={3} title="Membership" icon={<UserPlus size={18} />} />

      <Card className={`${styles.card} ${config.className}`}>
        <div className={styles.content}>
          <div className={styles.header}>
            <div className={styles.iconWrap}>
              <Icon size={24} strokeWidth={2.5} />
            </div>
            <div>
              <h4>{config.title}</h4>
              <p className={styles.status}>{config.message}</p>
            </div>
          </div>

          {showButton && (
            <Button
              variant="primary"
              disabled={loading}
              onClick={handleRequestMembership}
              className={styles.btn}
            >
              {loading? "Sending request..." : "Request Membership"}
            </Button>
          )}

          {successMessage && <p className={styles.success}>{successMessage}</p>}
          {errorMessage && <p className={styles.error}>{errorMessage}</p>}
        </div>
      </Card>
    </section>
  );
}
