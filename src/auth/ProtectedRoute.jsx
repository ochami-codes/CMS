// src/auth/ProtectedRoute.jsx
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({
  requiredPermission = null,  // New: backend permission to check
  requireMember = false,      // Keep old member check
}) {
  const { user } = useAuth();

  // Not logged in → redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Block non-members if required
  if (requireMember && !user.is_member) {
    return <Navigate to="/onboarding" replace />;
  }

  // Permission check
  if (
    requiredPermission &&
    !user.permissions?.includes(requiredPermission)
  ) {
    return <Navigate to="/onboarding" replace />;
  }

  return <Outlet />;
}
