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
  } = useAuth();
console.log("user", user);
  if (!user) {
    return <Loader fullScreen={false} />;
  }

  // -----------------------------------------
  // User data
  // -----------------------------------------

  const churches =
    user.churches ?? [];

  const membershipRequests =
    user.membershipRequests ?? [];

  // -----------------------------------------
  // Membership state
  // -----------------------------------------

  const activeChurches =
    churches.filter(
      (church) =>
        church.status === "active"
    );

  const pendingRequests =
    membershipRequests.filter(
      (request) =>
        request.status === "pending"
    );

  const rejectedRequests =
    membershipRequests.filter(
      (request) =>
        request.status === "rejected"
    );

  const hasActiveChurches =
    activeChurches.length > 0;

  const hasPendingRequests =
    pendingRequests.length > 0;

  const hasRejectedRequests =
    rejectedRequests.length > 0;

  // -----------------------------------------
  // Open church
  // -----------------------------------------

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
          user.full_name || "Member"
        } 🙏`}
        subtitle="Choose a church to continue."
      />

      {/* -------------------------
          Active Churches
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
          Pending Requests
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
          Rejected Requests
      ------------------------- */}

      {hasRejectedRequests && (
        <section>
          <h2 className={styles.title}>
            Membership Requests
          </h2>

          <div className={styles.grid}>
            {rejectedRequests.map(
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
                      styles.statusError
                    }
                  >
                    Request Declined
                  </p>

                  <Button
                    onClick={() =>
                      navigate(
                        "/join-church"
                      )
                    }
                  >
                    Try Another Church
                  </Button>
                </Card>
              )
            )}
          </div>
        </section>
      )}

      {/* -------------------------
          No Membership / Requests
      ------------------------- */}

      {!hasActiveChurches &&
        !hasPendingRequests &&
        !hasRejectedRequests && (
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
          Church Actions
      ------------------------- */}

      {(hasActiveChurches ||
        hasPendingRequests ||
        hasRejectedRequests) && (
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