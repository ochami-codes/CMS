// src/routes/ProtectedRoute.jsx
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Loader from "../components/Loader";

export default function ProtectedRoute({ allowedRoles }) {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return <Loader message="Checking session…" />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 🚨 profile might briefly be null
  if (!profile) {
    return <Loader message="Loading profile…" />;
  }

  if (allowedRoles && !allowedRoles.includes(profile.role_name)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
