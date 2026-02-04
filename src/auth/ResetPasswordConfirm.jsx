// src/auth/ResetPasswordConfirm.jsx
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "../supabaseClient";
import Input from "../components/Input";
import Button from "../components/Button";
import Loader from "../components/Loader";
import { isStrongPassword } from "../utils/validators";

export default function ResetPasswordConfirm() {
  const navigate = useNavigate();

  const [sessionReady, setSessionReady] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  /* --------------------------------------------------
     1️⃣ Read recovery session from URL hash
  -------------------------------------------------- */
  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    const params = new URLSearchParams(hash);

    const access_token = params.get("access_token");
    const refresh_token = params.get("refresh_token");

    if (!access_token || !refresh_token) {
      setError("Invalid or expired password reset link.");
      return;
    }

    supabase.auth
      .setSession({ access_token, refresh_token })
      .then(({ error }) => {
        if (error) {
          setError("Invalid or expired password reset link.");
          return;
        }
        setSessionReady(true);
      });
  }, []);

  /* --------------------------------------------------
     2️⃣ Submit new password
  -------------------------------------------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    setError("");

    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    if (!isStrongPassword(password)) {
      setError(
        "Password must be at least 6 characters and include letters and numbers."
      );
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    await supabase.auth.signOut();
    navigate("/login", { replace: true });
  };

  /* ---------------- Invalid link ---------------- */
  if (error && !sessionReady) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-md text-center">
          <p className="text-red-600">{error}</p>
          <Link
            to="/login"
            className="mt-4 inline-block text-blue-600 hover:underline"
          >
            Back to Login
          </Link>
        </div>
      </div>
    );
  }

  /* ---------------- Verifying session ---------------- */
  if (!sessionReady) {
    return <Loader message="Verifying reset link… God loves you!" />;
  }

  /* ---------------- Form ---------------- */
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50">
      <div className="w-full max-w-md card p-6 shadow-md">
        <h2 className="text-2xl font-bold mb-4 text-center">
          Set New Password
        </h2>

        <p className="text-gray-600 mb-6 text-center">
          Choose a strong password for your account.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="password"
            label="New password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <Input
            type="password"
            label="Confirm password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
          />

          {error && (
            <p className="text-red-600 text-sm text-center">{error}</p>
          )}

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Updating…" : "Update Password"}
          </Button>
        </form>

        <div className="mt-4 text-center">
          <Link to="/login" className="text-blue-600 hover:underline text-sm">
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
