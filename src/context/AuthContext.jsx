// src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { AuthAPI } from "../utils/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  /* -------------------------------
     Core auth state
  ------------------------------- */
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  /* -------------------------------
     Fetch /auth/me
     Single source of truth
  ------------------------------- */
  const fetchMe = useCallback(async () => {
    try {
      const data = await AuthAPI.me();

      if (!data?.user) {
        setUser(null);
        return null;
      }

      const normalizedUser = {
        id: data.user.id,
        email: data.user.email,
        full_name: data.user.full_name ?? "Guest",
        role_name: data.user.role_name ?? "guest",
        church_id: data.user.church_id ?? null,
        church_name: data.user.church_name ?? null,
        is_member: data.user.is_member ?? false,
        membership_status: data.user.membership_status ?? "none",
      };

      setUser(normalizedUser);
      return normalizedUser;
    } catch (err) {
      console.error("fetchMe failed:", err);
      localStorage.removeItem("access_token");
      setUser(null);
      return null;
    }
  }, []);

  /* -------------------------------
     Login
  ------------------------------- */
  const login = async ({ email, password }) => {
    setAuthError(null);
    setLoading(true);

    try {
      const data = await AuthAPI.login({ email, password });
      if (!data?.access_token) throw new Error("Login failed");

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
    } catch {}
    localStorage.removeItem("access_token");
    setUser(null);
  };

  /* -------------------------------
     Auth initialization (ONCE)
  ------------------------------- */
useEffect(() => {
  const token = localStorage.getItem("access_token");

  //  No token → don't wait for anything
  if (!token) {
    setUser(null);
    setLoading(false);
    return;
  }

  //  Stop blocking UI immediately
  setLoading(false);

  // Verify token in background
  fetchMe();
}, [fetchMe]);
  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        authError,
        login,
        logout,
        refetchUser: fetchMe,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
