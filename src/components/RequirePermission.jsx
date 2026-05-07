// src/components/RequirePermission.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function RequirePermission({
  permission,
  role,
  children,
}) {
  const {
    user,
    canUser,
    hasRole,
    authReady,
  } = useAuth();

  // wait for auth bootstrap
  if (!authReady) return null;

  // not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // role protection
  if (role && !hasRole(role)) {
    return <Navigate to="/dashboard" replace />;
  }

  // permission protection
  if (permission && !canUser(permission)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
