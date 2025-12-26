import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const { data: subscription } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (!session) {
          navigate("/login", { replace: true });
          return;
        }

        if (event === "PASSWORD_RECOVERY") {
          navigate("/reset-password-confirm", { replace: true });
        } else {
          navigate("/dashboard", { replace: true });
        }
      }
    );

    return () => {
      subscription?.subscription?.unsubscribe();
    };
  }, [navigate]);

  return <p>Confirming your account…</p>;
}