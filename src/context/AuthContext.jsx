import { createContext, useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { AuthAPI } from "../utils/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  let location;
  try {
    location = useLocation();
  } catch {
    location = { pathname: "" };
  }

  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

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
      console.error("fetchMe error:", err);
      localStorage.removeItem("access_token");
      setUser(null);
      setProfile(null);
      return null;
    }
  };

  const login = async ({ email, password }) => {
    setLoading(true);
    setAuthError(null);

    try {
      const data = await AuthAPI.login({ email, password });

      if (!data?.access_token) {
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

  const logout = async () => {
    try {
      await AuthAPI.logout();
    } finally {
      localStorage.removeItem("access_token");
      setUser(null);
      setProfile(null);
    }
  };

  const refreshUser = async () => {
    setLoading(true);
    await fetchMe();
    setLoading(false);
  };

  useEffect(() => {
    let active = true;

    const init = async () => {
      if (isPublicAuthRoute) {
        if (active) setLoading(false);
        return;
      }

      const token = localStorage.getItem("access_token");
      if (!token) {
        if (active) setLoading(false);
        return;
      }

      await fetchMe();
      if (active) setLoading(false);
    };

    init();

    return () => {
      active = false;
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
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
