import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function VerifyPending() {
  const navigate = useNavigate();

  // Optional: auto-redirect to login after 30–60 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/login");
    }, 60000); // 60 seconds

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div
      className="container"
      style={{
        maxWidth: "600px",
        margin: "5rem auto",
        textAlign: "center",
        padding: "2rem",
        borderRadius: "1rem",
        boxShadow: "0 0 15px rgba(0,0,0,0.1)",
        backgroundColor: "#f9fafb",
      }}
    >
      <h2 style={{ marginBottom: "1rem", fontSize: "1.8rem", color: "#1f2937" }}>
        Registration Successful!
      </h2>

      <p
        style={{
          fontSize: "1.2rem",
          fontStyle: "italic",
          color: "#065f46",
          marginBottom: "2rem",
        }}
      >
        "The Lord is good to all: and His tender mercies are over all His work." <br />
        <strong>— Psalm 146:9</strong>
      </p>

      <p style={{ fontSize: "1rem", color: "#1f2937" }}>
        Please check your email for the verification link. <br />
        While you wait, you can reflect on God's goodness today.
      </p>

      <p style={{ fontSize: "0.9rem", marginTop: "2rem", color: "#6b7280" }}>
        You will be redirected to the login page shortly.
      </p>
    </div>
  );
}
