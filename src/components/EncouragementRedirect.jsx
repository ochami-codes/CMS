import { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import encouragementVerses from "../utils/encouragementVerses";

export default function EncouragementRedirect({
  title = "All set ✨",
  message = "You’ll be redirected shortly.",
  redirectTo = "/login",
  delay = 5000,
  onComplete, // ✅ new optional prop
}) {
  const navigate = useNavigate();

  const verse = useMemo(() => {
    return encouragementVerses[
      Math.floor(Math.random() * encouragementVerses.length)
    ];
  }, []);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (onComplete) await onComplete(); // call it first if provided
      navigate(redirectTo, { replace: true });
    }, delay);

    return () => clearTimeout(timer);
  }, [navigate, redirectTo, delay, onComplete]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50">
      <div className="card p-6 shadow-md w-full max-w-md text-center">
        <h2 className="text-2xl font-bold mb-3">{title}</h2>

        <p className="text-gray-600 mb-4">{message}</p>

        <blockquote
          style={{
            fontStyle: "italic",
            color: "#374151",
            marginBottom: "0.75rem",
          }}
        >
          “{verse.text}”
        </blockquote>

        <p style={{ fontWeight: 500, color: "#4f46e5" }}>
          — {verse.ref}
        </p>

        <p className="text-sm text-gray-500 mt-4">
          Redirecting in {delay / 1000} seconds…
        </p>

        <button
          className="btn btn-secondary mt-4"
          onClick={() => navigate(redirectTo, { replace: true })}
        >
          Go now
        </button>
      </div>
    </div>
  );
}
