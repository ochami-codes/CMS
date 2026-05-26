import { useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

import Button from "../components/Button";
import ChurchSwitcher from "../components/ChurchSwitcher";

export default function SuspendedScreen() {
  const navigate = useNavigate();

  const {
    activeChurchName,
    activeMembership,
    memberships = [],
  } = useAuth();

  const reason =
    activeMembership?.status_reason;

  const hasAlternativeChurch =
    memberships.some(
      (m) =>
        m.status === "active" &&
        m.church_id !==
          activeMembership?.church_id
    );

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>

        <h1 style={styles.title}>
          Access Suspended
        </h1>

        <p style={styles.text}>
          Your membership in{" "}
          <strong>
            {activeChurchName}
          </strong>{" "}
          is currently suspended.
        </p>

        {reason && (
          <div style={styles.reasonBox}>
            <div style={styles.reasonTitle}>
              Reason
            </div>

            <p style={styles.reason}>
              {reason}
            </p>
          </div>
        )}

        <p style={styles.subtext}>
          Suspension only affects this
          church membership. Your account
          is still active.
        </p>

        {/* -------------------------
            SWITCH CHURCH
        ------------------------- */}

        {hasAlternativeChurch && (
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>
              Switch Church
            </h3>

            <p style={styles.helper}>
              You still belong to other
              churches.
            </p>

            <ChurchSwitcher />
          </div>
        )}

        {/* -------------------------
            ACTIONS
        ------------------------- */}

        <div style={styles.actions}>

          <Button
            onClick={() =>
              navigate("/join-church")
            }
          >
            Join Another Church
          </Button>

          <Button
            variant="secondary"
            onClick={() =>
              navigate("/create-church")
            }
          >
            Create Church
          </Button>

        </div>

      </div>
    </div>
  );
}

/* --------------------------------
   STYLES
-------------------------------- */

const styles = {
  wrapper: {
    minHeight: "100vh",

    display: "flex",

    justifyContent: "center",

    alignItems: "center",

    padding: "1.5rem",

    background: "#f3f4f6",
  },

  card: {
    width: "100%",

    maxWidth: "520px",

    background: "#fff",

    borderRadius: "16px",

    padding: "2rem",

    textAlign: "center",

    boxShadow:
      "0 12px 30px rgba(0,0,0,.08)",
  },

  title: {
    color: "#b91c1c",

    marginBottom: "1rem",

    fontSize: "1.75rem",
  },

  text: {
    color: "#374151",

    lineHeight: 1.6,
  },

  subtext: {
    marginTop: "1rem",

    color: "#6b7280",

    fontSize: ".95rem",
  },

  reasonBox: {
    marginTop: "1.5rem",

    padding: "1rem",

    borderRadius: "10px",

    background: "#fef2f2",

    textAlign: "left",
  },

  reasonTitle: {
    fontWeight: 700,

    marginBottom: ".5rem",

    color: "#991b1b",
  },

  reason: {
    margin: 0,

    color: "#374151",
  },

  section: {
    marginTop: "2rem",
  },

  sectionTitle: {
    marginBottom: ".25rem",
  },

  helper: {
    color: "#6b7280",

    fontSize: ".9rem",

    marginBottom: "1rem",
  },

  actions: {
    marginTop: "2rem",

    display: "flex",

    flexDirection: "column",

    gap: ".75rem",
  },
};
