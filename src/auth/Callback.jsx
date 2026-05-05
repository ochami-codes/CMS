import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AuthCallback() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const { refetchUser, user } = useAuth();

  useEffect(() => {
    const handleAuth = async () => {
      const type = params.get("type");
      const origin = params.get("origin");

      // Ignore password flows
      if (origin === "reset" || origin === "change-password") {
        return;
      }

      try {
        // 🔥 IMPORTANT: fetch user after Supabase sets session
        const refreshedUser = await refetchUser();

        // If no user → fallback to login
        if (!refreshedUser) {
          navigate("/login", { replace: true });
          return;
        }

        // 🧠 Check if user has an active membership
        const hasActiveChurch = refreshedUser.memberships?.some(
          (m) => m.status === "active"
        );

        if (hasActiveChurch) {
          navigate("/dashboard", { replace: true });
        } else {
          navigate("/onboarding", { replace: true });
        }

      } catch (err) {
        console.error("Auth callback error:", err);
        navigate("/login", { replace: true });
      }
    };

    handleAuth();
  }, [params, navigate, refetchUser]);

  return (
    <div className="h-screen flex items-center justify-center px-4">
      <p className="text-lg font-medium text-center">
        Setting up your account…
      </p>
    </div>
  );
}
