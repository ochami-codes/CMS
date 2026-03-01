// src/auth/ProtectedRoute.jsx
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({
  allowedRoles,
  requireMember = false,
}) {
  const { user } = useAuth();

  //  Not logged in → instant redirect
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  //  Block non-members if required
  if (requireMember && !user.is_member) {
    return <Navigate to="/dashboard" replace />;
  }

  //  Role restriction
  if (allowedRoles && !allowedRoles.includes(user.role_name)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
