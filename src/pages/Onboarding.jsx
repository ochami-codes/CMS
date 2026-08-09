import { useNavigate, Navigate } from "react-router-dom";
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
  } = useAuth();

  if (!user) {
    return <Loader fullScreen={false} />;
  }

  /* -------------------------
     SUSPENDED MEMBER
  ------------------------- */

  const isSuspended =
    user.activeChurch?.status === "suspended";

  if (isSuspended) {
    return (
      <Navigate
        to="/suspended"
        replace
      />
    );
  }

  /* -------------------------
     USER DATA
  ------------------------- */

  const churches =
    user.churches ?? [];

  const membershipRequests =
    user.membershipRequests ?? [];

  /* -------------------------
     MEMBERSHIP STATE
  ------------------------- */

  const activeChurches =
    churches.filter(
      (church) =>
        church.status === "active"
    );

  const pendingRequests =
    membershipRequests.filter(
      (request) =>
        request.status === "requested"
    );

  const hasActiveChurches =
    activeChurches.length > 0;

  const hasPendingRequests =
    pendingRequests.length > 0;

  /* -------------------------
     OPEN CHURCH
  ------------------------- */

  async function handleOpenChurch(
    churchId
  ) {
    const success =
      await switchChurch(churchId);

    if (success) {
      navigate("/dashboard");
    }
  }

  return (
    <div className={styles.container}>
      <PageHeader
        title={`Welcome, ${
          user.fullName || "Member"
        } 🙏`}
        subtitle="Choose a church to continue."
      />

      {/* -------------------------
          ACTIVE CHURCHES
      ------------------------- */}

      {hasActiveChurches && (
        <section>
          <h2 className={styles.title}>
            Your Churches
          </h2>

          <div className={styles.grid}>
            {activeChurches.map(
              (church) => (
                <Card
                  key={church.id}
                  className={
                    styles.churchCard
                  }
                >
                  <h3>
                    {church.name}
                  </h3>

                  <p
                    className={
                      styles.statusSuccess
                    }
                  >
                    Active Member
                  </p>

                  <Button
                    onClick={() =>
                      handleOpenChurch(
                        church.id
                      )
                    }
                  >
                    Enter Church
                  </Button>
                </Card>
              )
            )}
          </div>
        </section>
      )}

      {/* -------------------------
          PENDING REQUESTS
      ------------------------- */}

      {hasPendingRequests && (
        <section>
          <h2 className={styles.title}>
            Pending Membership Requests
          </h2>

          <div className={styles.grid}>
            {pendingRequests.map(
              (request) => (
                <Card
                  key={request.id}
                  className={
                    styles.churchCard
                  }
                >
                  <h3>
                    {request.church?.name ??
                      "Church"}
                  </h3>

                  <p
                    className={
                      styles.statusPending
                    }
                  >
                    Membership Pending
                  </p>

                  <p
                    className={
                      styles.note
                    }
                  >
                    Your request is awaiting
                    approval.
                  </p>
                </Card>
              )
            )}
          </div>
        </section>
      )}

      {/* -------------------------
          NO MEMBERSHIP / REQUESTS
      ------------------------- */}

      {!hasActiveChurches &&
        !hasPendingRequests && (
          <Card
            className={
              styles.churchCard
            }
          >
            <h3>
              Get Started
            </h3>

            <p
              className={
                styles.note
              }
            >
              Join an existing church or
              create a new one.
            </p>

            <div
              className={
                styles.actionsInline
              }
            >
              <Button
                onClick={() =>
                  navigate(
                    "/join-church"
                  )
                }
              >
                Join a Church
              </Button>

              <Button
                variant="outline"
                onClick={() =>
                  navigate(
                    "/create-church"
                  )
                }
              >
                Create Church
              </Button>
            </div>
          </Card>
        )}

      {/* -------------------------
          CHURCH ACTIONS
      ------------------------- */}

      {(hasActiveChurches ||
        hasPendingRequests) && (
        <div
          className={
            styles.actions
          }
        >
          <Card>
            <h3>
              Join a Church
            </h3>

            <p>
              Find and join another
              church.
            </p>

            <Button
              onClick={() =>
                navigate(
                  "/join-church"
                )
              }
            >
              Explore Churches
            </Button>
          </Card>

          <Card>
            <h3>
              Create a Church
            </h3>

            <p>
              Start a new church
              community.
            </p>

            <Button
              variant="outline"
              onClick={() =>
                navigate(
                  "/create-church"
                )
              }
            >
              Create Church
            </Button>
          </Card>
        </div>
      )}
    </div>
  );
}