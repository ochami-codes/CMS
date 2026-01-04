import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Loader from "../components/Loader";

/**
 * @param {Array<string>} allowedRoles - optional array of roles that can access this route
 */
export default function ProtectedRoute({ allowedRoles }) {
  const { user, profile, loading } = useAuth();
  const location = useLocation();

  // 1️⃣ Still checking auth state
  if (loading) {
    return <Loader message="Checking session…" />;
  }

  // 2️⃣ Not logged in → redirect to login
  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // 3️⃣ Profile may be null if backend doesn't return it
  if (!profile) {
    return <Loader message="Loading profile…" />;
  }

  // 4️⃣ If allowedRoles is set, check if the user’s role is allowed
  if (allowedRoles && !allowedRoles.includes(profile.role)) {
    // Redirect unauthorized users
    return <Navigate to="/dashboard" replace />;
  }

  // 5️⃣ Authorized → render nested routes
  return <Outlet />;
}