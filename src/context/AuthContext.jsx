// src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { AuthAPI } from "../utils/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const location = useLocation();

  /* -------------------------------
     Core state
  ------------------------------- */
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  /* -------------------------------
     Routes that DO NOT require auth
  ------------------------------- */
  const publicRoutes = [
    "/login",
    "/register",
    "/reset-password",
    "/auth/reset-password-confirm",
    "/profile/change-password-success",
  ];

  const isPublicRoute = publicRoutes.some((route) =>
    location.pathname.startsWith(route)
  );

  /* -------------------------------
     Fetch /auth/me (single source)
  ------------------------------- */
  const fetchMe = useCallback(async () => {
    try {
      const res = await AuthAPI.me();

      if (!res?.user) {
        setUser(null);
        return null;
      }

      // DO NOT invent defaults here – backend is truth
      setUser(res.user);
      return res.user;
    } catch (err) {
      console.error("AuthContext fetchMe error:", err);
      localStorage.removeItem("access_token");
      setUser(null);
      return null;
    }
  }, []);

  /* -------------------------------
     Login
  ------------------------------- */
  const login = async ({ email, password }) => {
    setLoading(true);
    setAuthError(null);

    try {
      const res = await AuthAPI.login({ email, password });

      if (!res?.access_token) {
        throw new Error("Invalid login response");
      }

      localStorage.setItem("access_token", res.access_token);
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
    } catch {
      // ignore
    } finally {
      localStorage.removeItem("access_token");
      setUser(null);
    }
  };

  /* -------------------------------
     Init auth ONCE (no spinner loop)
  ------------------------------- */
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("access_token");

      if (!token || isPublicRoute) {
        setLoading(false);
        return;
      }

      await fetchMe();
      setLoading(false);
    };

    initAuth();
  }, [fetchMe, isPublicRoute]);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        authError,
        login,
        logout,
        refetchUser: fetchMe, // useful after role approval
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
