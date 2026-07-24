import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({
  requiredPermission = null,
  allowSuspended = false,
}) {
  const { user } = useAuth();

  /* -------------------------
     1. Must be logged in
  ------------------------- */

  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  /* -------------------------
     2. Active Church Context
  ------------------------- */

  const activeChurch =
    user.activeChurch;

  const status =
    activeChurch?.status ?? "none";

  const permissions =
    activeChurch?.permissions ?? [];

  /* -------------------------
     3. Suspended Members
  ------------------------- */

  const isSuspended =
    status === "suspended";

  if (
    isSuspended &&
    !allowSuspended
  ) {
    return (
      <Navigate
        to="/suspended"
        replace
      />
    );
  }

  /* -------------------------
     4. Permission Check
  ------------------------- */

  if (
    requiredPermission &&
    !permissions.includes(
      requiredPermission
    )
  ) {
    return (
      <Navigate
        to="/dashboard"
        replace
      />
    );
  }

  return <Outlet />;
}
