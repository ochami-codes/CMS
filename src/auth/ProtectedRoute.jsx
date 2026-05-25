import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({
  requiredPermission = null,
  allowSuspended = false,
}) {
  const { user, isSuspendedMember } = useAuth();

  /* -------------------------
     1. Must be logged in
  ------------------------- */
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  /* -------------------------
     2. Block suspended users
  ------------------------- */
  if (isSuspendedMember && !allowSuspended) {
    return <Navigate to="/suspended" replace />;
  }

  /* -------------------------
     3. Permission check
  ------------------------- */
  if (
    requiredPermission &&
    !user.permissions?.includes(requiredPermission)
  ) {
    return <Navigate to="/dashboard" replace />;
  }

  /* -------------------------
     4. Allow access
  ------------------------- */
  return <Outlet />;
}
