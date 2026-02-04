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

  /* --------------------------------------------------
     Public routes that must NEVER auto-authenticate
  -------------------------------------------------- */
  const isPublicAuthRoute =
    location.pathname.startsWith("/auth/reset-password") ||
    location.pathname.startsWith("/auth/reset-password-confirm") ||
    location.pathname.startsWith("/verify-pending") ||
    location.pathname.startsWith("/login") ||
    location.pathname.startsWith("/register");

  /* --------------------------------------------------
     Fetch current authenticated user
  -------------------------------------------------- */
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
      setUser(null);
      setProfile(null);
      localStorage.removeItem("access_token");
      return null;
    } finally {
      setLoading(false);
    }
  };

  /* --------------------------------------------------
     Login
  -------------------------------------------------- */
  const login = async ({ email, password }) => {
    setLoading(true);
    setAuthError(null);

    try {
      const data = await AuthAPI.login({ email, password });

      if (!data?.access_token || !data?.user) {
        throw new Error("Login failed");
      }

      localStorage.setItem("access_token", data.access_token);

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
      setAuthError(err.message || "Login failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /* --------------------------------------------------
     Logout
  -------------------------------------------------- */
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

  /* --------------------------------------------------
     Refresh user manually
  -------------------------------------------------- */
  const refreshUser = async () => {
    setLoading(true);
    return await fetchMe();
  };

  /* --------------------------------------------------
     Bootstrap auth ONCE per route change
  -------------------------------------------------- */
  useEffect(() => {
    // ⛔ Never auto-authenticate on public auth routes
    if (isPublicAuthRoute) {
      setLoading(false);
      return;
    }

    const token = localStorage.getItem("access_token");

    if (!token) {
      setLoading(false);
      return;
    }

    fetchMe();
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
