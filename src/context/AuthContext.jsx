// src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { AuthAPI } from "../utils/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const location = useLocation();

  /* -------------------------------
     Core state
  ------------------------------- */
  const [user, setUser] = useState(null);       // auth identity
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  /* -------------------------------
     Public routes (skip auth)
  ------------------------------- */
  const publicAuthRoutes = [
    "/login",
    "/register",
    "/reset-password",
    "/change-password-success",
    "/profile/change-password-success",
    "/auth/reset-password-confirm",
  ];

  const isPublicAuthRoute = publicAuthRoutes.some((route) =>
    location.pathname.startsWith(route)
  );

  /* -------------------------------
     Fetch /auth/me
  ------------------------------- */
  const fetchMe = async () => {
    try {
      const data = await AuthAPI.me();

      if (!data?.user) {
        setUser(null);
        return null;
      }

      // Normalize all users, including Guests
      const normalized = {
        id: data.user.id,
        email: data.user.email,
        role_name: data.user.role_name ?? "Guest",
        church_id: data.user.church_id ?? null,
        church_name: data.user.church_name ?? "Seventh-day Adventist Church",
        full_name: data.user.full_name ?? "Guest",
        is_member: data.user.is_member ?? false,
        membership_status: data.user.membership_status ?? "none",
      };

      setUser(normalized);
      return normalized;
    } catch (err) {
      console.error("fetchMe error:", err);
      localStorage.removeItem("access_token");
      setUser(null);
      return null;
    }
  };

  /* -------------------------------
     Login
  ------------------------------- */
  const login = async ({ email, password }) => {
    setLoading(true);
    setAuthError(null);

    try {
      const data = await AuthAPI.login({ email, password });
      if (!data?.access_token) throw new Error("Login failed");

      localStorage.setItem("access_token", data.access_token);
      await fetchMe(); // always fetch auth identity
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
     Init auth on route change
  ------------------------------- */
  useEffect(() => {
    const init = async () => {
      if (isPublicAuthRoute) {
        setLoading(false);
        return;
      }

      const token = localStorage.getItem("access_token");
      if (!token) {
        setLoading(false);
        return;
      }

      await fetchMe();
      setLoading(false);
    };

    init();
  }, [location.pathname]);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        authError,
        login,
        logout,
        refetchUser: fetchMe, // can call to refresh guest/member state
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
