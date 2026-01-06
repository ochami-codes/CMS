// src/auth/ProtectedRoute.jsx
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Loader from "../components/Loader";

/**
 * @param {Array<string>} allowedRoles - optional array of roles allowed for this route
 */
export default function ProtectedRoute({ allowedRoles }) {
  const { user, profile, loading } = useAuth();
  const location = useLocation();

  // 1️⃣ Still loading auth/profile info
  if (loading) return <Loader message="Checking session…" />;

  // 2️⃣ Not logged in → redirect to login
  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // 3️⃣ Profile may be null if backend didn't return it yet
  if (!profile) return <Loader message="Loading profile…" />;

  // 4️⃣ If user is not verified → redirect to verify-email page
  if (!profile.is_verified) {
    return <Navigate to="/verify-email-info" replace />;
  }

  // 5️⃣ Role-based access check
  if (allowedRoles && !allowedRoles.includes(profile.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  // 6️⃣ Authorized → render nested routes
  return <Outlet />;
}