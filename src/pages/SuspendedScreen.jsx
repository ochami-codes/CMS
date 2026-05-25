import { useAuth } from "../context/AuthContext";
export default function SuspendedScreen() {
  const {
    activeChurchName,
    logout,
    activeMembership,
  } = useAuth();
const styles = {
  wrapper: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#f3f4f6",
  },
  card: {
    background: "#fff",
    padding: "2rem",
    borderRadius: "12px",
    textAlign: "center",
    maxWidth: "420px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
  },
  title: {
    color: "#b91c1c",
    marginBottom: "1rem",
  },
  text: {
    marginBottom: "0.5rem",
  },
  reason: {
    marginTop: "1rem",
    fontWeight: "600",
    color: "#374151",
  },
  subtext: {
    marginTop: "1rem",
    fontSize: "0.9rem",
    color: "#6b7280",
  },
  button: {
    marginTop: "1.5rem",
    padding: "0.6rem 1.2rem",
    background: "#111827",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },
};
  const reason =
    activeMembership?.status_reason;

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <h1 style={styles.title}>
          Access Suspended
        </h1>

        <p style={styles.text}>
          Your access to{" "}
          <strong>{activeChurchName}</strong>{" "}
          has been suspended.
        </p>

        {reason && (
          <p style={styles.reason}>
            Reason: {reason}
          </p>
        )}

        <p style={styles.subtext}>
          Please contact church leadership
          for more information.
        </p>

        <button
          onClick={logout}
          style={styles.button}
        >
          Logout
        </button>
      </div>
    </div>
  );
}
