import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function AuthCallback() {
  const navigate = useNavigate();
  const [params] = useSearchParams();

  useEffect(() => {
    const type = params.get("type");
    const origin = params.get("origin"); // optional: identify the flow

    // Only handle signup email verification
    if (type === "signup") {
      navigate("/login", { replace: true, state: { verified: true } });
      return;
    }

    // If this callback was triggered for reset or password change, do nothing
    if (origin === "reset" || origin === "change-password") {
      // optional: maybe show a message instead of redirecting
      return;
    }

    // Default fallback: go to login safely
    navigate("/login", { replace: true });
  }, [params, navigate]);

  return (
    <div className="h-screen flex items-center justify-center px-4">
      <p className="text-lg font-medium text-center">
        Email verified. Redirecting…
      </p>
    </div>
  );
}
