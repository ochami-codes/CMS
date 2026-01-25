// src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import { AuthAPI } from "../utils/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchMe = async () => {
    try {
      const data = await AuthAPI.me();
      setUser(data?.user ?? null);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      if (!mounted) return;
      await fetchMe();
    };

    init();

    return () => {
      mounted = false;
    };
  }, []);

  const logout = async () => {
    try {
      await AuthAPI.logout();
    } finally {
      setUser(null);
    }
  };

  const refreshUser = async () => {
    setLoading(true);
    await fetchMe();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        logout,
        refreshUser,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
