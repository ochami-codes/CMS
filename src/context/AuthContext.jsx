import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from "react";
import { AuthAPI, RolesAPI } from "../utils/api";
import { normalizeRole } from "../config/roles.js";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  /* -------------------------------
     Core auth state
  ------------------------------- */
  const [user, setUser] = useState(null);
  const [authReady, setAuthReady] = useState(false);
  const [authError, setAuthError] = useState(null);

  const [rolesData, setRolesData] = useState({
    roles: [],
    roleLabels: {},
    requestableRoles: [],
    allRoles: [],
    allPermissions: [],
  });

  /* -------------------------------
     Fetch roles
  ------------------------------- */
  const fetchRoles = useCallback(async () => {
    try {
      const data = await RolesAPI.getAll();

      const roles = (data.roles || []).map((r) => ({
        name: normalizeRole(r.name),
        label: r.label || r.name,
        requestable: r.requestable ?? false,
        permissions: r.permissions || [],
      }));

      const roleLabels = roles.reduce((acc, r) => {
        acc[r.name] = r.label;
        return acc;
      }, {});

      const allPermissions = [
        ...new Set(roles.flatMap((r) => r.permissions)),
      ];

      const requestableRoles = (data.requestable_roles || []).map(
        normalizeRole
      );

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
        memberships: data.user.memberships || [],
        active_church: data.user.active_church || null,
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
     Derived state (safe + memoized)
  ------------------------------- */
  const activeChurch = useMemo(
    () => user?.active_church || null,
    [user]
  );

  const activeMembership = useMemo(() => {
    if (!user?.memberships || !activeChurch?.id) return null;

    return user.memberships.find(
      (m) => m.church_id === activeChurch.id
    );
  }, [user, activeChurch]);

  /* -------------------------------
     Login
  ------------------------------- */
  const login = async ({ email, password }) => {
    setAuthError(null);
    setAuthReady(false);

    try {
      const data = await AuthAPI.login({ email, password });

      if (!data?.access_token) {
        throw new Error("Login failed");
      }

      localStorage.setItem("access_token", data.access_token);

      const realUser = await fetchMe();

      if (!realUser) {
        throw new Error("Failed to load user");
      }

      fetchRoles();
    } catch (err) {
      setAuthError(err.message || "Login failed");
      throw err;
    } finally {
      setAuthReady(true);
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

    setRolesData({
      roles: [],
      roleLabels: {},
      requestableRoles: [],
      allRoles: [],
      allPermissions: [],
    });
  };

  /* -------------------------------
     Init
  ------------------------------- */
  useEffect(() => {
    const token = localStorage.getItem("access_token");

    if (!token) {
      setUser(null);
      setAuthReady(true);
      return;
    }

    fetchMe().finally(() => setAuthReady(true));
    fetchRoles();
  }, [fetchMe, fetchRoles]);

  /* -------------------------------
     Helpers
  ------------------------------- */
  const canUser = (permission) => {
    if (!user) return false;
    if (!permission) return true;

    if (user.roles.includes("admin")) return true;

    return user.permissions.includes(permission);
  };

  const isAdmin = () => user?.roles?.includes("admin") ?? false;

  const hasRole = (role) =>
    user?.roles?.includes(normalizeRole(role)) ?? false;

  const getRoleLabel = (role) =>
    rolesData.roleLabels[normalizeRole(role)] || role;

  /* -------------------------------
     Provider
  ------------------------------- */
  return (
    <AuthContext.Provider
      value={{
        user,
        rolesData,
        authReady,
        authError,
        login,
        logout,
        refetchUser: fetchMe,

        canUser,
        isAdmin,
        hasRole,
        getRoleLabel,

        // multi-church
        activeChurch,
        activeMembership,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
