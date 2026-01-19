// src/routes/ProtectedRoute.jsx
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Loader from "../components/Loader";

export default function ProtectedRoute({ allowedRoles }) {
  const { token, user, loading } = useAuth();
  const location = useLocation();

  // ⏳ Still resolving auth
  if (loading) {
    return <Loader message="Checking session…" />;
  }

  // 🔐 Not authenticated
  if (!token || !user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // 📧 Email not verified
  if (!user.email_confirmed_at) {
    return <Navigate to="/verify-email-info" replace />;
  }

  // 🛡️ Role-based access control
  if (
    allowedRoles &&
    !allowedRoles.includes(user.role_name)
  ) {
    return <Navigate to="/dashboard" replace />;
  }

  // ✅ Access granted
  return <Outlet />;
}
