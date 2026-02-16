// src/auth/ProtectedRoute.jsx
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Loader from "../components/Loader";

/**
 * ProtectedRoute ensures:
 * 1. User is authenticated
 * 2. Role is allowed (based on user.role_name)
 * 3. Optionally, waits for profile if `requireProfile` is true
 */
export default function ProtectedRoute({ allowedRoles, requireProfile = false }) {
  const { user, profile, loading } = useAuth();

  // Show loader while fetching auth
  if (loading) return <Loader message="Checking session…" />;

  // Not authenticated → redirect to login
  if (!user) return <Navigate to="/login" replace />;

  // Require full profile → wait for it
  if (requireProfile && !profile) return <Loader message="Loading profile…" />;

  // Role-based restriction (using auth identity)
  if (allowedRoles && !allowedRoles.includes(user.role_name || "Member")) {
    return <Navigate to="/dashboard" replace />;
  }

  // ✅ Authenticated and allowed
  return <Outlet />;
}
