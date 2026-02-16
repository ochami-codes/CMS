// src/auth/ProtectedRoute.jsx
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Loader from "../components/Loader";

/**
 * ProtectedRoute ensures:
 * 1. User is authenticated
 * 2. User role is allowed
 * 3. Optionally blocks guests / pending members
 */
export default function ProtectedRoute({
  allowedRoles,
  requireMember = false,
}) {
  const { user, loading } = useAuth();

  // Still checking session
  if (loading) {
    return <Loader message="Checking session…" />;
  }

  // Not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Block guests / pending members
  if (requireMember && !user.is_member) {
    return <Navigate to="/dashboard" replace />;
  }

  // Role-based restriction
  if (allowedRoles && !allowedRoles.includes(user.role_name)) {
    return <Navigate to="/dashboard" replace />;
  }

  // ✅ Allowed
  return <Outlet />;
}
