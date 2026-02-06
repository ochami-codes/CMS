import { createContext, useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { AuthAPI } from "../utils/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const location = useLocation(); // ✅ ALWAYS called

  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  /* -------------------------------
     Public routes (NO auto-auth)
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

      const normalized = {
        ...data.user,
        role_name: data.user.role_name || "Member",
        active: data.user.active ?? true,
      };

      setUser(normalized);
      setProfile({
        ...normalized,
        full_name: normalized.full_name || "Child of God",
      });

      return normalized;
    } catch (err) {
      console.error("fetchMe error:", err);
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

      if (!data?.access_token) {
        throw new Error("Login failed");
      }

      localStorage.setItem("access_token", data.access_token);

      await fetchMe(); // ✅ THIS triggers re-render
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
    setProfile(null);
  };

  /* -------------------------------
     Init auth ONCE per route change
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
        profile,
        loading,
        authError,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
