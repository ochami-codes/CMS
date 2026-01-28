import { createContext, useContext, useEffect, useState } from "react";
import { AuthAPI } from "../utils/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  /* ------------------ Fetch current session ------------------ */
  const fetchMe = async () => {
    try {
      const data = await AuthAPI.me();

      if (!data?.user) {
        setUser(null);
        setProfile(null);
        return null;
      }

      setUser(data.user);

      // Normalize profile if exists
      setProfile({
        ...data.profile,
        role_name: data.profile?.roles?.name || data.user.role_name,
      });

      return data;
    } catch (err) {
      setUser(null);
      setProfile(null);
      return null;
    } finally {
      setLoading(false);
    }
  };

/* ------------------ Login ------------------ */
const login = async ({ email, password }) => {
  setLoading(true);
  setAuthError(null);

  try {
    const data = await AuthAPI.login({ email, password });

    if (!data?.user || !data?.access_token) {
      throw new Error("Login failed: no access token or user returned");
    }

    // ✅ store SUPABASE access token
    localStorage.setItem("access_token", data.access_token);

    // remove legacy token if present
    localStorage.removeItem("token");

    // Normalize user
    const normalizedUser = {
      ...data.user,
      role_name: data.user.role_name || data.user.roles?.name,
    };

    setUser(normalizedUser);

    setProfile({
      ...normalizedUser,
    });

    return normalizedUser;
  } catch (err) {
    setAuthError(err.message || "Login failed");
    throw err;
  } finally {
    setLoading(false);
  }
};
  /* ------------------ Logout ------------------ */
  const logout = async () => {
    try {
      await AuthAPI.logout();
    } finally {
      setUser(null);
      setProfile(null);
      localStorage.removeItem("access_token");
    }
  };

  /* ------------------ Refresh user ------------------ */
  const refreshUser = async () => {
    setLoading(true);
    await fetchMe();
  };

  /* ------------------ Init on mount ------------------ */
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
