import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import Loader from "../components/Loader";
import Card from "../components/Card";
import Button from "../components/Button";
import PageHeader from "../components/PageHeader";

import styles from "../styles/pages/Onboarding.module.css";

export default function Onboarding() {
  const navigate = useNavigate();

  const {
    user,
    switchChurch,
    isActiveMember,
    isPendingMember,
    isRejectedMember,
    activeMembership,
    churchRequested,
    hasAnyMembership,
  } = useAuth();

  if (!user) return <Loader />;

  async function handleOpenChurch(churchId) {
    const success = await switchChurch(churchId);

    if (success) {
      navigate("/dashboard");
    }
  }

  return (
    <div className={styles.container}>
      <PageHeader
        title={`Welcome back, ${user.full_name || "User"} 👋`}
        subtitle="Choose how you'd like to continue"
      />

      {/* ---------------- ACTIVE MEMBERSHIPS ---------------- */}
      {isActiveMember && hasAnyMembership && (
        <section>
          <h2 className={styles.title}>Your Churches</h2>

          <div className={styles.grid}>
            {user.memberships
              .filter((m) => m.status === "active")
              .map((m) => (
                <Card key={m.id} className={styles.churchCard}>
                  <h3>{m.church_name}</h3>

                  <p className={styles.statusSuccess}>
                    Active Member
                  </p>

                  <Button onClick={() => handleOpenChurch(m.church_id)}>
                    Open Church
                  </Button>
                </Card>
              ))}
          </div>
        </section>
      )}

      {/* ---------------- PENDING REQUEST ---------------- */}
      {isPendingMember &&(
        <section>
          <h2 className={styles.title}>Membership Request</h2>

          <Card className={styles.churchCard}>
            <h3>{churchRequested}</h3>

            <p className={styles.statusPending}>
              Pending Approval
            </p>

            <p className={styles.note}>
              Your request is being reviewed by church leadership.
            </p>
          </Card>
        </section>
      )}

      {/* ---------------- REJECTED REQUEST ---------------- */}
      {isRejectedMember &&(
        <section>
          <h2 className={styles.title}>Membership Request</h2>

          <Card className={styles.churchCard}>
            <h3>{churchRequested}</h3>

            <p className={styles.statusError}>
              Request Rejected
            </p>

            <p className={styles.note}>
              You can try joining another church or resubmit your request.
            </p>

            <Button onClick={() => navigate("/join-church")}>
              Try Again
            </Button>
          </Card>
        </section>
      )}

      {/* ---------------- EMPTY STATE ---------------- */}
      {!hasAnyMembership && !isPendingMember && !isRejectedMember && (
        <Card>
          <h3>No church membership yet</h3>
          <p>Join a church or create one to get started.</p>
        </Card>
      )}

      {/* ---------------- ACTIONS ---------------- */}
      <div className={styles.actions}>
        <Card>
          <h3>Join Church</h3>
          <p>Request access to an existing church.</p>

          <Button onClick={() => navigate("/join-church")}>
            Join Church
          </Button>
        </Card>

        <Card>
          <h3>Create Church</h3>
          <p>Start a new church workspace.</p>

          <Button
            variant="outline"
            onClick={() => navigate("/create-church")}
          >
            Create Church
          </Button>
        </Card>
      </div>
    </div>
  );
}
