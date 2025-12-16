// src/auth/ProtectedRoute.jsx
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import Loader from "../components/Loader";

export default function ProtectedRoute() {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Still checking auth state
  if (loading) {
    return <Loader message="Checking session…" />;
  }

  // Not authenticated → redirect to login
  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location }}
      />
    );
  }

  // Authenticated → render nested routes
  return <Outlet />;
}
