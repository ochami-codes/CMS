import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({
  requiredPermission = null,
}) {
  const { user } = useAuth();

  /* -------------------------
     1. Must be logged in
  ------------------------- */
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  /* -------------------------
     2. Permission check
  ------------------------- */
  if (
    requiredPermission &&
    !user.permissions?.includes(requiredPermission)
  ) {
    return <Navigate to="/dashboard" replace />;
  }

  /* -------------------------
     3. Allow access
     (NO onboarding logic here)
  ------------------------- */
  return <Outlet />;
}
