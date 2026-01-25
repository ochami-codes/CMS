// src/routes/ProtectedRoute.jsx
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Loader from "../components/Loader";

export default function ProtectedRoute({ allowedRoles }) {
  const { user, loading } = useAuth();

  // ⏳ Wait for Supabase to resolve session
  if (loading) {
    return <Loader message="Checking session…" />;
  }

  // 🔐 Not authenticated
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 🛡️ Role-based access control
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  // ✅ Authorized
  return <Outlet />;
}
