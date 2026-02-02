import { createContext, useContext, useEffect, useState } from "react";
import { AuthAPI } from "../utils/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);      // user object from backend
  const [profile, setProfile] = useState(null); // copy of user for convenience
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  /* ---------------- Fetch current session ---------------- */
  const fetchMe = async () => {
    try {
      const data = await AuthAPI.me(); // should return { user: {...} }

      if (!data?.user) {
        setUser(null);
        setProfile(null);
        return null;
      }

      // Normalize user
      const normalizedUser = {
        ...data.user,
        role_name: data.user.role_name || "Member",
        active: data.user.active ?? true, // fallback to active if missing
      };

      setUser(normalizedUser);

      // profile can be used in frontend components
      setProfile({
        ...normalizedUser,
        full_name: normalizedUser.full_name || "Child of God",
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

      if (!data?.user || !data?.access_token)
        throw new Error("Login failed: no access token or user returned");

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
    return await fetchMe();
  };

  /* ---------------- Init on mount ---------------- */
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) fetchMe();
    else setLoading(false);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,       // allows updating role dynamically
        profile,
        setProfile,    // convenience for UI
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
