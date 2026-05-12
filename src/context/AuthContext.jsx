import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from "react";
import { AuthAPI, RolesAPI, ChurchAPI } from "../utils/api";
import { normalizeRole } from "../config/roles.js";
import { supabase } from "../supabaseClient";

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

  active_church_id: data.user.active_church_id || null,
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
  const activeChurchId = useMemo(
  () => user?.active_church_id || null,
  [user]
);
  const activeMembership = useMemo(() => {
  if (!user?.memberships || !user?.active_church_id) return null;

  return user.memberships.find(
    (m) => m.church_id === user.active_church_id
  ) || null;
}, [user]);

const switchChurch = async (churchId) => {
  try {
    await ChurchAPI.setActiveChurch({ church_id: churchId });

    await fetchMe(); // CRITICAL

    return true;
  } catch (err) {
    console.error("Switch church failed:", err);
    return false;
  }
};

const currentMembership = useMemo(() => {
  if (!user?.memberships || !user?.active_church_id) return null;

  return (
    user.memberships.find(
      (m) => m.church_id === user.active_church_id
    ) || null
  );
}, [user]);

const activeMembershipStatus = useMemo(() => {
  return currentMembership?.status || "guest";
}, [currentMembership]);

const isActiveMember = useMemo(() => {
  return activeMembershipStatus === "active";
}, [activeMembershipStatus]);

const isPendingMember = useMemo(() => {
  return activeMembershipStatus === "requested";
}, [activeMembershipStatus]);

const isGuest = useMemo(() => {
  return !currentMembership || activeMembershipStatus === "guest";
}, [currentMembership, activeMembershipStatus]);

const hasAnyMembership = useMemo(() => {
  return (user?.memberships?.length || 0) > 0;
}, [user]);



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
   Membership realtime updates
------------------------------- */
useEffect(() => {
  if (!user?.id) return;

  const shouldSubscribe =
    user.membership_status === "requested";

  if (!shouldSubscribe) return;

  const channel = supabase
    .channel(`membership-request-${user.id}`)
    .on(
      "postgres_changes",
      {
        event: "UPDATE",
        schema: "public",
        table: "membership_requests",
        filter: `profile_id=eq.${user.id}`,
      },
      async (payload) => {
        const newStatus = payload.new.status;

        // Only react when request handled
        if (
          newStatus === "approved" ||
          newStatus === "rejected"
        ) {
          await fetchMe();
        }
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}, [user, fetchMe]);

  /* -------------------------------
     Helpers
  ------------------------------- */
const isAdmin = useCallback(
  () =>
    user?.roles?.includes("admin") ?? false,
  [user]
);


const canUser = useCallback(
  (permission, options = {}) => {
    if (!user) return false;

    const {
      roles,
      requireActiveMember = false,
    } = options;

    // membership gate
    if (
      requireActiveMember &&
      !isActiveMember
    ) {
      return false;
    }

    // role check
    if (roles?.length) {
      const hasRoleMatch =
        roles.some((r) =>
          user.roles.includes(
            normalizeRole(r)
          )
        );

      if (!hasRoleMatch) {
        return false;
      }
    }

    // admin override
    if (isAdmin()) return true;

    // permission check
    if (permission) {
      return user.permissions.includes(
        permission
      );
    }

    // public access
    return true;
  },
  [user, isActiveMember, isAdmin]
);
 
  const hasRole = (role) =>
    user?.roles?.includes(normalizeRole(role)) ?? false;

  const getRoleLabel = (role) =>
    rolesData.roleLabels[normalizeRole(role)] || role;
const dashboardMode = useMemo(() => {
  if (isActiveMember) return "member";
  if (isPendingMember) return "requested";
  return "guest";
}, [
  isActiveMember,
  isPendingMember,
]);


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
        activeChurchId,
        switchChurch,
        activeMembership,
        currentMembership,
    activeMembershipStatus,
    isActiveMember,
    isPendingMember,
    isGuest,
    hasAnyMembership,
    dashboardMode,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
