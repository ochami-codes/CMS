// src/routes/ProtectedRoute.jsx
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Loader from "../components/Loader";

export default function ProtectedRoute({ allowedRoles }) {
  const { user, loading } = useAuth();

  // ⏳ Wait while Supabase resolves the session
  if (loading) {
    return <Loader message="Checking session…" />;
  }

  // 🔐 Not authenticated
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 🛡️ Role-based access control
  // Use `role_name` since `user` object has role_id & roles.name
  if (allowedRoles && !allowedRoles.includes(user.role_name)) {
    return <Navigate to="/dashboard" replace />;
  }

  // ✅ Authorized
  return <Outlet />;
}
