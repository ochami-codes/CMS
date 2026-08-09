// components/NetworkStatus.jsx
import useOnlineStatus from "../hooks/useOnlineStatus";

export default function NetworkStatus() {
  const isOnline = useOnlineStatus();

  if (isOnline) {
    return null;
  }

  const styles = {
    container: {
      backgroundColor: "#ffdddd",
      color: "#a94442",
      padding: "10px 15px",
      border: "1px solid #a94442",
      borderRadius: "4px",
      textAlign: "center",
      fontSize: "14px",
      position: "fixed",
      bottom: "20px",
      left: "50%",
      transform: "translateX(-50%)",
      boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
      zIndex: 1000,
    },
  };

  return (
    <div style={styles.container}>
      You are currently offline. Some features may not be available.
    </div>
  );
}
