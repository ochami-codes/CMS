import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Loader from "../components/Loader";

export default function ProtectedRoute({ allowedRoles }) {
  const { user, profile, loading } = useAuth();

  // Show loader while fetching user
  if (loading) {
    return <Loader message="Checking session…" />;
  }

  // Not authenticated → redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Profile might briefly be null; show loader
  if (!profile) {
    return <Loader message="Loading profile…" />;
  }

  // Role-based restriction
  if (allowedRoles && !allowedRoles.includes(profile.role_name || "Member")) {
    return <Navigate to="/dashboard" replace />;
  }

  // ✅ Authenticated & allowed
  return <Outlet />;
}
