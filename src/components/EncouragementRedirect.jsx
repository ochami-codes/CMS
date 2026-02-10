import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import encouragementVerses from "../utils/encouragementVerses";

export default function EncouragementRedirect({
  title = "All set ✨",
  message = "You’ll be redirected shortly.",
  redirectTo = "/login",
  delay = 10000, // default 10s
  onComplete, // optional callback
}) {
  const navigate = useNavigate();
  const [secondsLeft, setSecondsLeft] = useState(delay / 1000);

  const verse = useMemo(() => {
    return encouragementVerses[
      Math.floor(Math.random() * encouragementVerses.length)
    ];
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsLeft((s) => s - 1);
    }, 1000);

    const timeout = setTimeout(async () => {
      if (onComplete) await onComplete();
      navigate(redirectTo, { replace: true });
    }, delay);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [delay, navigate, redirectTo, onComplete]);

  return (
    <div className="dashboard-content" style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
      <div className="card" style={{ maxWidth: "400px", width: "100%", textAlign: "center", padding: "2rem", gap: "1.5rem", display: "flex", flexDirection: "column" }}>
        <h2 className="text-lg font-semibold">{title}</h2>

        <p style={{ color: "#4b5563", marginBottom: "1rem" }}>{message}</p>

        <blockquote style={{ fontStyle: "italic", color: "#374151", marginBottom: "0.5rem" }}>
          “{verse.text}”
        </blockquote>

        <p style={{ fontWeight: 500, color: "#4f46e5", marginBottom: "1rem" }}>— {verse.ref}</p>

        <p style={{ fontSize: "0.875rem", color: "#6b7280" }}>
          Redirecting in {secondsLeft} second{secondsLeft !== 1 ? "s" : ""}…
        </p>

        <button
          className="btn btn-secondary"
          onClick={async () => {
            if (onComplete) await onComplete();
            navigate(redirectTo, { replace: true });
          }}
        >
          Go now
        </button>
      </div>
    </div>
  );
}
