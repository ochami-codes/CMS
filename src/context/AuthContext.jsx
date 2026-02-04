import { createContext, useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { AuthAPI } from "../utils/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const location = useLocation();

  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  /* -------------------------------
     Public routes (NO auto-auth)
  ------------------------------- */
  const publicAuthRoutes = [
    "/auth/reset-password",
    "/auth/reset-password-confirm",
    "/verify-pending",
    "/login",
    "/register",
  ];

  const isPublicAuthRoute = publicAuthRoutes.some((route) =>
    location.pathname.startsWith(route)
  );

  /* -------------------------------
     Fetch authenticated user
  ------------------------------- */
  const fetchMe = async () => {
    try {
      const data = await AuthAPI.me();

      if (!data?.user) {
        setUser(null);
        setProfile(null);
        return null;
      }

      const normalizedUser = {
        ...data.user,
        role_name: data.user.role_name || "Member",
        active: data.user.active ?? true,
      };

      setUser(normalizedUser);
      setProfile({
        ...normalizedUser,
        full_name: normalizedUser.full_name || "Child of God",
      });

      return normalizedUser;
    } catch (err) {
      console.error("Auth fetchMe error:", err);
      localStorage.removeItem("access_token");
      setUser(null);
      setProfile(null);
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

      if (!data?.access_token || !data?.user) {
        throw new Error("Login failed");
      }

      localStorage.setItem("access_token", data.access_token);

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
      setProfile(null);
    }
  };

  /* -------------------------------
     Manual refresh
  ------------------------------- */
  const refreshUser = async () => {
    setLoading(true);
    await fetchMe();
    setLoading(false);
  };

  /* -------------------------------
     Init auth on route change
  ------------------------------- */
  useEffect(() => {
    let mounted = true;

    const initAuth = async () => {
      if (isPublicAuthRoute) {
        if (mounted) setLoading(false);
        return;
      }

      const token = localStorage.getItem("access_token");
      if (!token) {
        if (mounted) setLoading(false);
        return;
      }

      await fetchMe();
      if (mounted) setLoading(false);
    };

    initAuth();

    return () => {
      mounted = false;
    };
  }, [location.pathname]);

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        authError,
        login,
        logout,
        refreshUser,
        setUser,
        setProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
