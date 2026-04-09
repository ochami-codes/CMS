// src/components/RequirePermission.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function RequirePermission({ permission, role, children }) {
  const { user, loading } = useAuth();

  // Still resolving auth
  if (loading) return null;

  // Not logged in
  if (!user) return <Navigate to="/login" replace />;

  // Role-only guard (Admin pages)
  if (role && user.role_name !== role) return <Navigate to="/dashboard" replace />;

  // Permission-based guard
  if (permission && !user.permissions?.includes(permission)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
