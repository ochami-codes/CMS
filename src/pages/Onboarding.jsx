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
    churchRequested,
    hasAnyMembership,
  } = useAuth();

  if (!user) return <Loader />;

  async function handleOpenChurch(churchId) {
    const success = await switchChurch(churchId);
    if (success) navigate("/dashboard");
  }

  return (
    <div className={styles.container}>

      {/* ---------------- WELCOME HEADER ---------------- */}
      <PageHeader
        title={`Welcome in Christ, ${user.full_name || "beloved member"} 🙏`}
        subtitle="We’re glad you’re here."
      />

      {/* ---------------- ACTIVE MEMBERSHIPS ---------------- */}
      {isActiveMember && hasAnyMembership && (
        <section>
          <h2 className={styles.title}>Your Church Family</h2>

          <div className={styles.grid}>
            {user.memberships
              .filter((m) => m.status === "active")
              .map((m) => (
                <Card key={m.id} className={styles.churchCard}>
                  <h3>{m.church_name}</h3>

                  <p className={styles.statusSuccess}>
                    You are an active member
                  </p>

                  <p className={styles.note}>
                    Step into your church space to continue fellowship, service, and growth.
                  </p>

                  <Button onClick={() => handleOpenChurch(m.church_id)}>
                    Enter Church
                  </Button>
                </Card>
              ))}
          </div>
        </section>
      )}

      {/* ---------------- PENDING REQUEST ---------------- */}
      {isPendingMember && (
        <section>
          <h2 className={styles.title}>Your Membership Journey</h2>

          <Card className={styles.churchCard}>
            <h3>{churchRequested}</h3>

            <p className={styles.statusPending}>
              Awaiting Confirmation
            </p>

            <p className={styles.note}>
              Your request has been received and is being prayerfully reviewed by church leadership.
              You will be notified once it is approved.
            </p>
          </Card>
        </section>
      )}

      {/* ---------------- REJECTED REQUEST ---------------- */}
      {isRejectedMember && (
        <section>
          <h2 className={styles.title}>Membership Update</h2>

          <Card className={styles.churchCard}>
            <h3>{churchRequested}</h3>

            <p className={styles.statusError}>
              Request Not Approved
            </p>

            <p className={styles.note}>
              Don’t be discouraged. You are still welcome to continue your journey by joining another church
              or submitting a new request.
            </p>

            <Button onClick={() => navigate("/join-church")}>
              Try Again
            </Button>
          </Card>
        </section>
      )}

      {/* ---------------- EMPTY STATE ---------------- */}
      {!hasAnyMembership && !isPendingMember && !isRejectedMember && (
        <Card className={styles.churchCard}>
          <h3>Welcome child of God</h3>

          <p className={styles.note}>
            You have not joined a church yet. Take your next step to join an existing church ar create yours.
          </p>

          <div className={styles.actionsInline}>
            <Button onClick={() => navigate("/join-church")}>
              Join a Church
            </Button>

            <Button
              variant="outline"
              onClick={() => navigate("/create-church")}
            >
              Create Church
            </Button>
          </div>
        </Card>
      )}

      {/* ---------------- ACTIONS ---------------- */}
      <div className={styles.actions}>
        <Card>
          <h3>Join a Church</h3>
          <p>Connect with an existing church family and begin fellowship.</p>

          <Button onClick={() => navigate("/join-church")}>
            Explore Churches
          </Button>
        </Card>

        <Card>
          <h3>Create a Church</h3>
          <p>Start a new ministry and build a faith community.</p>

          <Button
            variant="outline"
            onClick={() => navigate("/create-church")}
          >
            Start Church
          </Button>
        </Card>
      </div>
    </div>
  );
}