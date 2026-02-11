import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import encouragementVerses from "../utils/encouragementVerses";
import "../styles/layout.css";
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
  <div className="dashboard-content redirect-container">
    <div className="card redirect-card">
      <h2 className="redirect-title">{title}</h2>

      <p className="redirect-message">{message}</p>

      <blockquote className="redirect-verse">
        “{verse.text}”
      </blockquote>

      <p className="redirect-ref">— {verse.ref}</p>

      <p className="redirect-timer">
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
