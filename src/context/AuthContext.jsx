// src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { AuthAPI, RolesAPI } from "../utils/api";
import { normalizeRole } from "../config/roles.js";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  /* -------------------------------
     Core auth state
  ------------------------------- */
  const [user, setUser] = useState(null);
  const [rolesData, setRolesData] = useState({
    roles: [],           // array of role objects for dropdowns
    roleLabels: {},      // map role name => label
    requestableRoles: [],// roles users can request
    allRoles: [],        // all roles
    allPermissions: [],  // all permissions
  });
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  /* -------------------------------
     Fetch /roles from backend
  ------------------------------- */
  const fetchRoles = useCallback(async () => {
    try {
      const data = await RolesAPI.getAll();

      const roles = (data.roles || []).map(r => ({
        name: normalizeRole(r.name),
        label: r.label || r.name,
        requestable: r.requestable ?? false,
        permissions: r.permissions || [],
      }));

      const roleLabels = roles.reduce((acc, r) => {
        acc[r.name] = r.label;
        return acc;
      }, {});

      const allPermissions = [...new Set(roles.flatMap(r => r.permissions))];
      const requestableRoles = (data.requestable_roles || []).map(normalizeRole);
      const allRoles = (data.all_roles || []).map(normalizeRole);

      setRolesData({
        roles,
        roleLabels,
        requestableRoles,
        allRoles,
        allPermissions,
      });

    } catch (err) {
      console.error("Failed to load roles:", err);
    }
  }, []);

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
  ...data.user,
  roles: (data.user.roles || []).map(normalizeRole),
  permissions: data.user.permissions || [],
  role_name: normalizeRole(
    data.user.role_name || data.user.roles?.[0] || "guest"
  ),
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
-------------------------------- */
const login = async ({ email, password }) => {
  setAuthError(null);
  setLoading(true);

  try {
    const data = await AuthAPI.login({ email, password });
    if (!data?.access_token) throw new Error("Login failed");

    localStorage.setItem("access_token", data.access_token);

    // ✅ Fetch real user BEFORE setting anything
    const realUser = await fetchMe();

    if (!realUser) {
      throw new Error("Failed to load user");
    }

    // ✅ Load roles in background (non-blocking)
    fetchRoles();

  } catch (err) {
    setAuthError(err.message || "Login failed");
    throw err;
  } finally {
    setLoading(false);
  }
};
/* -------------------------------
   Logout
-------------------------------- */
const logout = async () => {
  try {
    await AuthAPI.logout();
  } catch {}

  localStorage.removeItem("access_token");

  // ✅ Clear everything immediately
  setUser(null);

  // Optional: reset roles (prevents stale UI)
  setRolesData({
    roles: [],
    roleLabels: {},
    requestableRoles: [],
    allRoles: [],
    allPermissions: [],
  });
};
  /* -------------------------------
     Auth + roles initialization (ONCE)
  ------------------------------- */
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    // Load both roles and user data
    setLoading(true);
    fetchMe()
  .finally(() => setLoading(false));

// Load roles in background (non-blocking)
fetchRoles();
  }, [fetchMe, fetchRoles]);

  /* -------------------------------
     Permission & role helpers
  ------------------------------- */
  const canUser = (permission) => {
    if (!user) return false;
    if (!permission) return true;

    // Admin override
    if (user.roles.includes("admin")) return true;

    return user.permissions.includes(permission);
  };

  const isAdmin = () => user?.roles.includes("admin") ?? false;

  const hasRole = (role) => user?.roles.includes(normalizeRole(role)) ?? false;

  const getRoleLabel = (role) => rolesData.roleLabels[normalizeRole(role)] || role;

  return (
    <AuthContext.Provider
      value={{
        user,
        rolesData,
        loading,
        authError,
        login,
        logout,
        refetchUser: fetchMe,
        canUser,
        isAdmin,
        hasRole,
        getRoleLabel,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
