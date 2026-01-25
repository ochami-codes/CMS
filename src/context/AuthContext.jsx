// src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import { AuthAPI } from "../utils/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // true while fetching auth state
  const [authError, setAuthError] = useState(null);

  /* ------------------ Fetch current user ------------------ */
  const fetchMe = async () => {
    try {
      const data = await AuthAPI.me();
      setUser(data?.user ?? null);
      return data?.user ?? null;
    } catch (err) {
      setUser(null);
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

      // Save token in localStorage for session persistence
      if (data.token) localStorage.setItem("token", data.token);
      if (data.user) setUser(data.user);

      return data.user;
    } catch (err) {
      console.error("Login failed:", err);
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
      localStorage.removeItem("token");
    }
  };

  /* ------------------ Refresh user (re-fetch) ------------------ */
  const refreshUser = async () => {
    setLoading(true);
    await fetchMe();
  };

  /* ------------------ Initialize on mount ------------------ */
  useEffect(() => {
    let mounted = true;

    const init = async () => {
      if (!mounted) return;

      const token = localStorage.getItem("token");
      if (token) {
        await fetchMe();
      } else {
        setLoading(false);
      }
    };

    init();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        refreshUser,
        setUser,
        authError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
