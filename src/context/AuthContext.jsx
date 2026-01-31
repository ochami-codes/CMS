import { createContext, useContext, useEffect, useState } from "react";
import { AuthAPI } from "../utils/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  /* ---------------- Fetch current session ---------------- */
  const fetchMe = async () => {
    try {
      const data = await AuthAPI.me();

      if (!data?.user) {
        setUser(null);
        setProfile(null);
        return null;
      }

      // Always ensure role_name exists
      const roleName =
        data.user?.role_name ||
        data.user?.roles?.name ||
        data.profile?.roles?.name ||
        "Member"; // default

      const normalizedUser = {
        ...data.user,
        role_name: roleName,
      };

      setUser(normalizedUser);

      setProfile({
        ...normalizedUser,
        full_name: data.user.full_name || data.profile?.full_name || "Child of God",
      });

      return normalizedUser;
    } catch (err) {
      console.error("Auth fetchMe error:", err);
      setUser(null);
      setProfile(null);
      return null;
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- Login ---------------- */
  const login = async ({ email, password }) => {
    setLoading(true);
    setAuthError(null);

    try {
      const data = await AuthAPI.login({ email, password });

      if (!data?.user || !data?.access_token) {
        throw new Error("Login failed: no access token or user returned");
      }

      // store token
      localStorage.setItem("access_token", data.access_token);
      localStorage.removeItem("token");

      const roleName =
        data.user?.role_name || data.user?.roles?.name || "Member";

      const normalizedUser = {
        ...data.user,
        role_name: roleName,
      };

      setUser(normalizedUser);
      setProfile({
        ...normalizedUser,
        full_name: data.user.full_name || "Child of God",
      });

      return normalizedUser;
    } catch (err) {
      setAuthError(err.message || "Login failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- Logout ---------------- */
  const logout = async () => {
    try {
      await AuthAPI.logout();
    } finally {
      setUser(null);
      setProfile(null);
      localStorage.removeItem("access_token");
    }
  };

  /* ---------------- Refresh user ---------------- */
  const refreshUser = async () => {
    setLoading(true);
    await fetchMe();
  };

  /* ---------------- Init on mount ---------------- */
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      fetchMe();
    } else {
      setLoading(false);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        login,
        logout,
        refreshUser,
        authError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
