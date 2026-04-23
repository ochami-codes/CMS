// src/components/RequirePermission.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function RequirePermission({ permission, role, children }) {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;

  if (role && user.role_name !== role) {
    return <Navigate to="/dashboard" replace />;
  }

  if (permission && !user.permissions?.includes(permission)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
