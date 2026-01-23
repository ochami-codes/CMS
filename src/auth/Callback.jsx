import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function AuthCallback() {
  const navigate = useNavigate();
  const [params] = useSearchParams();

  useEffect(() => {
    const type = params.get("type");

    if (type === "signup") {
      // Navigate to login and pass state verified
      navigate("/login", { replace: true, state: { verified: true } });
      return;
    }

    // Fallback: just go to login
    navigate("/login", { replace: true });
  }, [params, navigate]);

  return (
    <div className="h-screen flex items-center justify-center">
      <p className="text-lg font-medium">Email verified. Redirecting…</p>
    </div>
  );
}
