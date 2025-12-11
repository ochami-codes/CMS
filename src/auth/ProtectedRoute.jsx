// src/auth/ProtectedRoute.jsx
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Loader from "../components/Loader";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  // Wait while checking session
  if (loading) return <Loader message= "Loading..."/>;

  // If no user → redirect to login
  if (!user) return <Navigate to="/login" replace />;

  // If children exist, render them
  // Otherwise return <Outlet /> for nested routes
  return children ? children : <Outlet />;
}
