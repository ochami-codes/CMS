import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function WaitingPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/login");
    }, 60000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="home-container">
      <div
        className="container"
        style={{
          maxWidth: "600px",
          marginTop: "5rem",
        }}
      >
        <div className="card" style={{ textAlign: "center" }}>
          <h2 style={{ fontSize: "1.6rem", fontWeight: 600, marginBottom: "0.75rem" }}>
            Registration Successful
          </h2>

          <p style={{ color: "#065f46", fontStyle: "italic", marginBottom: "1.5rem" }}>
            “The Lord is good to all: and His tender mercies are over all His work.”
            <br />
            <strong>— Psalm 146:9</strong>
          </p>

          <p style={{ color: "#374151", marginBottom: "1.2rem" }}>
            Please check your email for the verification link.
            <br />
            While you wait, take a moment to reflect on God’s goodness.
          </p>

          <p style={{ fontSize: "0.9rem", color: "#6b7280" }}>
            You will be redirected to the login page shortly.
          </p>
        </div>
      </div>
    </div>
  );
}
