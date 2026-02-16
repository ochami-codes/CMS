// src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { AuthAPI } from "../utils/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const location = useLocation();

  /* -------------------------------
     Core auth state
  ------------------------------- */
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  /* -------------------------------
     Public auth routes
  ------------------------------- */
  const publicAuthRoutes = [
    "/login",
    "/register",
    "/reset-password",
    "/auth/reset-password-confirm",
    "/change-password-success",
    "/profile/change-password-success",
  ];

  const isPublicAuthRoute = publicAuthRoutes.some((route) =>
    location.pathname.startsWith(route)
  );

  /* -------------------------------
     Fetch /auth/me
     (single source of truth)
  ------------------------------- */
  const fetchMe = useCallback(async () => {
    try {
      const data = await AuthAPI.me();

      if (!data?.user) {
        setUser(null);
        return null;
      }

      const normalizedUser = {
        id: data.user.id,
        email: data.user.email,
        full_name: data.user.full_name ?? "Guest",
        role_name: data.user.role_name ?? "Guest",
        church_id: data.user.church_id ?? null,
        church_name: data.user.church_name ?? null,
        is_member: data.user.is_member ?? false,
        membership_status: data.user.membership_status ?? "none",
      };

      setUser(normalizedUser);
      return normalizedUser;
    } catch (err) {
      console.error("fetchMe failed:", err);
      localStorage.removeItem("access_token");
      setUser(null);
      return null;
    }
  }, []);

  /* -------------------------------
     Login
  ------------------------------- */
  const login = async ({ email, password }) => {
    setAuthError(null);
    setLoading(true);

    try {
      const data = await AuthAPI.login({ email, password });
      if (!data?.access_token) throw new Error("Login failed");

      localStorage.setItem("access_token", data.access_token);

      // 🔑 Immediately resolve user after login
      await fetchMe();
    } catch (err) {
      setAuthError(err.message || "Login failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /* -------------------------------
     Logout
  ------------------------------- */
  const logout = async () => {
    try {
      await AuthAPI.logout();
    } catch {}
    localStorage.removeItem("access_token");
    setUser(null);
  };

  /* -------------------------------
     Auth initialization
     (runs on route change)
  ------------------------------- */
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("access_token");

      // 🚨 No token → unauthenticated
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      // 🔑 Token exists → ALWAYS resolve user
      await fetchMe();
      setLoading(false);
    };

    initAuth();
  }, [location.pathname, fetchMe]);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        authError,
        login,
        logout,
        refetchUser: fetchMe,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
