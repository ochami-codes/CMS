import {
  createContext,
  useContext,
  useEffect,
  useRef,
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
const lastVersion = useRef(null);
  const fetching = useRef(false);
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

  profileId: data.user.id,
  authUserId: data.user.auth_user_id,

  roles: (data.user.roles || []).map(normalizeRole),

  permissions:
    data.user.permissions || [],

  memberships:
    data.user.memberships || [],

  membership_requests:
    data.user.membership_requests || [],

  active_membership:
    data.user.active_membership || null,

  active_membership_request:
    data.user.active_membership_request || null,

  active_membership_status:
    data.user.active_membership_status || "guest",
  active_church_name: data.user.active_church_name || null,
  active_church_id:
    data.user.active_church_id || null,
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

const activeChurchName = user?.active_church_name || null;

const activeMembership =
  user?.active_membership || null;

const activeMembershipStatus =
  user?.active_membership_status || "guest";

const activeMembershipRequest =
  user?.active_membership_request || null;

const activeMembershipRequestStatus = user?.membership_requests?.status || null;
const isActiveMember =
  activeMembershipStatus === "active";

const isPendingMember =
  !!activeMembershipRequest;
const isRejectedMember =
  activeMembershipRequestStatus === "rejected";
const isGuest =
  !isActiveMember &&
  !isPendingMember;

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

  /* Membership realtime updates */

useEffect(() => {
  if (!authReady || !profileId) return;

  const channel = supabase
    .channel(`profile-sync-${profileId}`)
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "profiles",
        filter: `id=eq.${profileId}`,
      },
      async (payload) => {
        console.log("[RT] EVENT RECEIVED");
        console.log(payload);

        console.log("[RT] REFRESH USER");

        await fetchMe();
      }
    )
    .subscribe((status) => {
      console.log("[RT] STATUS:", status);
    });

  return () => {
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
        activeChurchName,

        activeMembership,
        activeMembershipStatus,

        isActiveMember,
        isPendingMember,
        isRejectedMember,
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
