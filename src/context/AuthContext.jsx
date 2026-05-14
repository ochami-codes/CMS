import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from "react";

import {
  AuthAPI,
  RolesAPI,
  ChurchAPI,
} from "../utils/api";

import { normalizeRole } from "../config/roles.js";

import { supabase } from "../supabaseClient";

const AuthContext = createContext(null);

export const AuthProvider = ({
  children,
}) => {
  /* -------------------------------
     Core auth state
  ------------------------------- */
  const [user, setUser] = useState(null);

  const [authReady, setAuthReady] =
    useState(false);

  const [authError, setAuthError] =
    useState(null);

  /* -------------------------------
     Roles metadata
  ------------------------------- */
  const [rolesData, setRolesData] =
    useState({
      roles: [],
      roleLabels: {},
      requestableRoles: [],
      allRoles: [],
      allPermissions: [],
    });

  /* -------------------------------
     Fetch roles metadata
  ------------------------------- */
  const fetchRoles = useCallback(
    async () => {
      try {
        const data =
          await RolesAPI.getAll();

        const roles = (
          data.roles || []
        ).map((r) => ({
          name: normalizeRole(r.name),

          label:
            r.label || r.name,

          requestable:
            r.requestable ?? false,

          permissions:
            r.permissions || [],
        }));

        const roleLabels =
          roles.reduce((acc, r) => {
            acc[r.name] = r.label;
            return acc;
          }, {});

        const allPermissions = [
          ...new Set(
            roles.flatMap(
              (r) => r.permissions
            )
          ),
        ];

        const requestableRoles = (
          data.requestable_roles || []
        ).map(normalizeRole);

        const allRoles = (
          data.all_roles || []
        ).map(normalizeRole);

        setRolesData({
          roles,
          roleLabels,
          requestableRoles,
          allRoles,
          allPermissions,
        });
      } catch (err) {
        console.error(
          "Failed to load roles:",
          err
        );
      }
    },
    []
  );

  /* -------------------------------
     Fetch authenticated user
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

      // identity contract (VERY IMPORTANT)
      profileId: data.user.id,
      authUserId: data.user.auth_user_id,

      roles: (data.user.roles || []).map(normalizeRole),
      permissions: data.user.permissions || [],
      memberships: data.user.memberships || [],
      membership_requests: data.user.membership_requests || [],
      active_membership: data.user.active_membership || null,
      active_membership_status:
        data.user.active_membership_status || "guest",
      active_church_id: data.user.active_church_id || null,
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
const profileId = user?.profileId || null;
const authUserId = user?.authUserId || null;
  /* -------------------------------
     Derived state
  ------------------------------- */

 const activeChurchId =
  user?.active_church_id || null;

const activeMembership =
  user?.active_membership || null;

const activeMembershipStatus =
  user?.active_membership_status || "guest";

const isActiveMember =
  activeMembershipStatus === "active";

const isPendingMember =
  activeMembershipStatus === "requested";

const isGuest =
  activeMembershipStatus === "guest";

const hasAnyMembership =
  (user?.memberships?.length || 0) > 0;

const dashboardMode =
  isActiveMember
    ? "member"
    : isPendingMember
    ? "requested"
    : "guest";
  /* -------------------------------
     Church switching
  ------------------------------- */

  const switchChurch =
    useCallback(
      async (churchId) => {
        try {
          await ChurchAPI.setActiveChurch(
            {
              church_id: churchId,
            }
          );

          await fetchMe();

          return true;
        } catch (err) {
          console.error(
            "Switch church failed:",
            err
          );

          return false;
        }
      },
      [fetchMe]
    );

  /* -------------------------------
     Login
  ------------------------------- */

  const login = async ({
    email,
    password,
  }) => {
    setAuthError(null);

    setAuthReady(false);

    try {
      const data =
        await AuthAPI.login({
          email,
          password,
        });

      if (!data?.access_token) {
        throw new Error(
          "Login failed"
        );
      }

      localStorage.setItem(
        "access_token",
        data.access_token
      );

      const realUser =
        await fetchMe();

      if (!realUser) {
        throw new Error(
          "Failed to load user"
        );
      }

      await fetchRoles();
    } catch (err) {
      setAuthError(
        err.message ||
          "Login failed"
      );

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

    localStorage.removeItem(
      "access_token"
    );

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
     Initial auth boot
  ------------------------------- */

  useEffect(() => {
    const token =
      localStorage.getItem(
        "access_token"
      );

    if (!token) {
      setUser(null);

      setAuthReady(true);

      return;
    }

    Promise.all([
      fetchMe(),
      fetchRoles(),
    ]).finally(() =>
      setAuthReady(true)
    );
  }, [fetchMe, fetchRoles]);

  /* -------------------------------
     Membership realtime updates
  ------------------------------- */

useEffect(() => {
  console.log("[RT] effect triggered");

  if (!authReady) {
    console.log("[RT] blocked: auth not ready");
    return;
  }

  if (!profileId) {
    console.log("[RT] blocked: no profileId");
    return;
  }

  console.log("[RT] starting subscription for:", profileId);

  const channel = supabase
    .channel(`membership-${profileId}`)

    /* -------------------------
       membership_requests
    ------------------------- */
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "membership_requests",
        filter: `profile_id=eq.${profileId}`,
      },
      (payload) => {
        console.log("🔥 REQUEST EVENT (signal only):", {
          event: payload.eventType,
          id: payload.new?.id,
        });

        // IMPORTANT: do NOT rely on payload (avoids 401 issues)
        fetchMe();
      }
    )

    /* -------------------------
       members
    ------------------------- */
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "members",
        filter: `profile_id=eq.${profileId}`,
      },
      (payload) => {
        console.log("🔥 MEMBER EVENT (signal only):", {
          event: payload.eventType,
          id: payload.new?.id,
        });

        fetchMe();
      }
    )

    .subscribe((status) => {
      console.log("[RT] subscription status:", status);
    });

  return () => {
    console.log("[RT] cleaning up:", profileId);
    supabase.removeChannel(channel);
  };
}, [authReady, profileId, fetchMe]);
  /* -------------------------------
     Permission helpers
  ------------------------------- */

  const isAdmin = useCallback(
    () =>
      user?.roles?.includes(
        "admin"
      ) ?? false,
    [user]
  );

  const hasRole = useCallback(
    (role) =>
      user?.roles?.includes(
        normalizeRole(role)
      ) ?? false,
    [user]
  );

  const canUser = useCallback(
    (
      permission,
      options = {}
    ) => {
      if (!user) return false;

      const {
        roles,
        requireActiveMember = false,
      } = options;

      if (
        requireActiveMember &&
        !isActiveMember
      ) {
        return false;
      }

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
      if (isAdmin()) {
        return true;
      }

      if (permission) {
        return user.permissions.includes(
          permission
        );
      }

      return true;
    },
    [user, isActiveMember, isAdmin]
  );

  const getRoleLabel =
    useCallback(
      (role) =>
        rolesData.roleLabels[
          normalizeRole(role)
        ] || role,
      [rolesData]
    );

  /* -------------------------------
     Provider
  ------------------------------- */

  return (
    <AuthContext.Provider
      value={{
        user,

        authReady,
        authError,

        rolesData,

        login,
        logout,

        refetchUser: fetchMe,

        switchChurch,

        canUser,
        isAdmin,
        hasRole,
        getRoleLabel,

        activeChurchId,

        activeMembership,
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

export const useAuth = () =>
  useContext(AuthContext);
