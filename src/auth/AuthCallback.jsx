import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;

    // Handle initial session
    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;

      if (data?.session) {
        navigate("/dashboard", { replace: true });
      }
    });

    // Listen for auth state changes (magic links, OAuth, etc.)
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (!mounted) return;

        if (session) {
          navigate("/dashboard", { replace: true });
        } else {
          navigate("/login", { replace: true });
        }
      }
    );

    return () => {
      mounted = false;
      listener?.subscription?.unsubscribe();
    };
  }, [navigate]);

  return <p>Confirming your account…</p>;
}