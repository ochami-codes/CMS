import { useEffect } from "react";
import {
  useNavigate,
  useSearchParams,
} from "react-router-dom";

import { useAuth } from "../context/AuthContext";

export default function AuthCallback() {
  const navigate = useNavigate();
  const [params] = useSearchParams();

  const {
    refetchUser,
  } = useAuth();

  useEffect(() => {
    let cancelled = false;

    const handleAuth = async () => {
      const type =
        params.get("type");

      const origin =
        params.get("origin");

      /* -------------------------
         Ignore password flows
      ------------------------- */

      if (
        origin === "reset" ||
        origin === "change-password" ||
        type === "recovery"
      ) {
        return;
      }

      try {
        /* -------------------------
           Refresh User
        ------------------------- */

        const {
          data: refreshedUser,
        } = await refetchUser();

        if (cancelled) return;

        /* -------------------------
           No Authenticated User
        ------------------------- */

        if (!refreshedUser) {
          navigate("/login", {
            replace: true,
          });

          return;
        }

        /* -------------------------
           Check Active Membership
        ------------------------- */

        const hasActiveChurch =
          refreshedUser.churches?.some(
            (church) =>
              church.status === "active"
          );

        if (hasActiveChurch) {
          navigate("/dashboard", {
            replace: true,
          });
        } else {
          navigate("/onboarding", {
            replace: true,
          });
        }
      } catch (err) {
        console.error(
          "Auth callback error:",
          err
        );

        if (!cancelled) {
          navigate("/login", {
            replace: true,
          });
        }
      }
    };

    handleAuth();

    return () => {
      cancelled = true;
    };
  }, [
    params,
    navigate,
    refetchUser,
  ]);

  return (
    <div className="h-screen flex items-center justify-center px-4">
      <p className="text-lg font-medium text-center">
        Setting up your account…
      </p>
    </div>
  );
}
