import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({
  allowSuspended = false,
}) {
  const {
    user,
    authReady,
  } = useAuth();

  /* -------------------------
     WAIT FOR AUTH
  ------------------------- */

  if (!authReady) {
    return null;
  }

  /* -------------------------
     AUTHENTICATION
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
     ACTIVE CHURCH
  ------------------------- */

  const status =
    user.activeChurch?.status ??
    "none";

  /* -------------------------
     SUSPENDED MEMBERS
  ------------------------- */

  if (
    status === "suspended" &&
    !allowSuspended
  ) {
    return (
      <Navigate
        to="/suspended"
        replace
      />
    );
  }

  return <Outlet />;
}
