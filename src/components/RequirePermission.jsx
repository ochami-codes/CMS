// src/components/RequirePermission.jsx

import { Navigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

export default function RequirePermission({
  permission = null,
  role = null,
  requireActiveMember = true,
  children,
}) {
  const {
    user,
    canUser,
    hasRole,
    authReady,
    isActiveMember,
  } = useAuth();

  /* -------------------------
     Wait for Auth Bootstrap
  ------------------------- */

  if (!authReady) {
    return null;
  }

  /* -------------------------
     Authentication
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
     Active Membership
  ------------------------- */

  if (
    requireActiveMember &&
    !isActiveMember
  ) {
    return (
      <Navigate
        to="/dashboard"
        replace
      />
    );
  }

  /* -------------------------
     Role Protection
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
     Permission Protection
  ------------------------- */

  if (
    permission &&
    !canUser(permission, {
      requireActiveMember,
    })
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
