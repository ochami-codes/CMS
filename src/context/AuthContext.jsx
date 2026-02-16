// src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { AuthAPI, ProfileAPI } from "../utils/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const location = useLocation();

  /* -------------------------------
     Core state
  ------------------------------- */
  const [user, setUser] = useState(null);       // auth identity
  const [profile, setProfile] = useState(null); // profile snapshot
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  /* -------------------------------
     Public routes (skip auth)
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
     Fetch auth identity
  ------------------------------- */
  const fetchMe = async () => {
    try {
      const data = await AuthAPI.me();
      if (!data?.user) {
        setUser(null);
        return null;
      }

      const normalized = {
        id: data.user.id,
        email: data.user.email,
        role_name: data.user.role_name ?? "Guest",
        church_id: data.user.church_id ?? null,
      };

      setUser(normalized);
      return normalized;
    } catch (err) {
      console.error("fetchMe error:", err);
      localStorage.removeItem("access_token");
      setUser(null);
      return null;
    }
  };

  /* -------------------------------
     Fetch profile snapshot
  ------------------------------- */
  const fetchProfile = async () => {
    try {
      const res = await ProfileAPI.get();

      // Ensure profile object always has role_name and church_id
      const normalizedProfile = {
        ...res?.profile,
        role_name: res?.profile?.role_name ?? "Guest",
        church_id: res?.profile?.church_id ?? null,
      };

      setProfile(normalizedProfile);
      return normalizedProfile;
    } catch (err) {
      console.error("fetchProfile error:", err);
      setProfile({
        full_name: "Child of God",
        role_name: "Guest",
        church_id: null,
      });
      return profile;
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
      if (!data?.access_token) throw new Error("Login failed");

      localStorage.setItem("access_token", data.access_token);

      const me = await fetchMe();
      if (me) await fetchProfile(); // block until profile is ready
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
     Init auth on route change
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

      const me = await fetchMe();
      if (me) await fetchProfile(); // block until profile is ready

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
        refetchProfile: fetchProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
