import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({
  requiredPermission = null,
}) {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const memberships = user.memberships || [];
  const hasActiveChurch = memberships.some(
    (m) => m.status === "active"
  );

  const isOnboardingPage = location.pathname.startsWith("/onboarding");

  // 🚧 Force onboarding if no active church
  if (!hasActiveChurch && !isOnboardingPage) {
    return <Navigate to="/onboarding" replace />;
  }

  // 🚀 Prevent going back to onboarding after setup
  if (hasActiveChurch && isOnboardingPage) {
    return <Navigate to="/dashboard" replace />;
  }

  // 🔐 Permission check
  if (
    requiredPermission &&
    !user.permissions?.includes(requiredPermission)
  ) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
