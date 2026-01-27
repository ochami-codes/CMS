// src/components/RequirePermission.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { canUser } from "../utils/permissions";

export default function RequirePermission({ permission, children }) {
  const { profile, loading } = useAuth();

  if (loading) return null;
  if (!profile) return <Navigate to="/login" replace />;

  if (!canUser(profile.role_name, permission)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
