import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function RequirePermission({
  permission = null,
  role = null,
  children,
}) {
  const {
    user,
    canUser,
    hasRole,
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
     ROLE PROTECTION
  ------------------------- */

  if (
    role &&
    !hasRole(role)
  ) {
    return (
      <Navigate
        to="/dashboard"
        replace
      />
    );
  }

  /* -------------------------
     PERMISSION PROTECTION
  ------------------------- */

  if (
    permission &&
    !canUser(permission)
  ) {
    return (
      <Navigate
        to="/dashboard"
        replace
      />
    );
  }

  return children;
}
