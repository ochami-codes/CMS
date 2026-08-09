import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import encouragementVerses from "../utils/encouragementVerses";
import styles from "../styles/components/EncouragementRedirect.module.css";

export default function EncouragementRedirect({
  title = "All set ✨",
  message = "You’ll be redirected shortly.",
  redirectTo = "/login",
  delay = 20000,
  onComplete,
}) {

  const navigate = useNavigate();

  const [secondsLeft, setSecondsLeft] = useState(
    delay / 1000
  );

  const verse = useMemo(() => {
    return encouragementVerses[
      Math.floor(
        Math.random() *
          encouragementVerses.length
      )
    ];
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsLeft(s => s - 1);
    }, 1000);

    const timeout = setTimeout(async () => {
      if (onComplete) await onComplete();

      navigate(redirectTo, {
        replace: true
      });
    }, delay);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [
    delay,
    navigate,
    redirectTo,
    onComplete
  ]);

  return (
    <div className={styles.container}>

      <div className={styles.card}>

        <h2 className={styles.title}>
          {title}
        </h2>

        <p className={styles.message}>
          {message}
        </p>

        <blockquote className={styles.verse}>
          “{verse.text}”
        </blockquote>

        <p className={styles.ref}>
          — {verse.ref}
        </p>

        <p className={styles.timer}>
          Redirecting in{" "}
          {secondsLeft} second
          {secondsLeft !== 1 ? "s" : ""}…
        </p>

        <button
          className={styles.button}
          onClick={async () => {
            if (onComplete) await onComplete();

            navigate(redirectTo, {
              replace: true
            });
          }}
        >
          Go now
        </button>

      </div>

    </div>
  );
}
