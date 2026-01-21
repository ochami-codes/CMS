import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function AuthCallback() {
  const navigate = useNavigate();
  const [params] = useSearchParams();

  useEffect(() => {
    const type = params.get("type");

    // Email verification flow (signup)
    if (type === "signup") {
      navigate("/login", {
        replace: true,
        state: { verified: true },
      });
      return;
    }

    // Fallback for unknown cases
    navigate("/login", { replace: true });
  }, []);

  return (
    <div className="h-screen flex items-center justify-center">
      <p className="text-lg font-medium">Email verified. Redirecting…</p>
    </div>
  );
}
