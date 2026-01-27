// src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import { AuthAPI } from "../utils/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);        // auth user
  const [profile, setProfile] = useState(null); // church profile
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  /* ------------------ Fetch current session ------------------ */
  const fetchMe = async () => {
    try {
      const data = await AuthAPI.me();

      if (!data) {
        setUser(null);
        setProfile(null);
        return null;
      }

      setUser(data.user);

      // 🔑 Normalize role_name ONCE
      setProfile({
        ...data.profile,
        role_name: data.profile?.roles?.name,
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

      if (data?.token) {
        localStorage.setItem("token", data.token);
      }

      await fetchMe();
      return data;
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
      localStorage.removeItem("token");
    }
  };

  /* ------------------ Refresh user ------------------ */
  const refreshUser = async () => {
    setLoading(true);
    await fetchMe();
  };

  /* ------------------ Init on mount ------------------ */
  useEffect(() => {
    const token = localStorage.getItem("token");

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
