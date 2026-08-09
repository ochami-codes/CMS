import { useCallback } from "react";
import { normalizeRole } from "../config/roles";

export function useAuthRoles(user) {
  /* -------------------------
     ACTIVE CHURCH
  ------------------------- */

  const activeChurch =
    user?.activeChurch ?? null;

  /* -------------------------
     ROLES
  ------------------------- */

  const userRoles =
    activeChurch?.roles?.map(
      (role) => role.name
    ) ?? [];

  /* -------------------------
     PERMISSIONS
  ------------------------- */

  const userPermissions =
    activeChurch?.permissions ?? [];

  /* -------------------------
     MEMBERSHIP STATE
  ------------------------- */

  const activeMembershipStatus =
    activeChurch?.status ?? "none";

  const isActiveMember =
    activeMembershipStatus === "active";

  const isPendingMember =
    activeMembershipStatus === "pending";

  const isSuspendedMember =
    activeMembershipStatus === "suspended";

  /* -------------------------
     ROLE CHECKS
  ------------------------- */

  const isAdmin = useCallback(
    () =>
      userRoles.includes("admin"),
    [userRoles]
  );

  const hasRole = useCallback(
    (role) =>
      userRoles.includes(
        normalizeRole(role)
      ),
    [userRoles]
  );

  /* -------------------------
     PERMISSION CHECK
  ------------------------- */

  const canUser = useCallback(
    (
      permission,
      options = {}
    ) => {
      /* -------------------------
         AUTHENTICATION
      ------------------------- */

      if (!user) {
        return false;
      }

      const {
        roles: requiredRoles,
        requireActiveMember = false,
      } = options;

      /* -------------------------
         ACTIVE MEMBERSHIP
      ------------------------- */

      if (
        requireActiveMember &&
        !isActiveMember
      ) {
        return false;
      }

      /* -------------------------
         ROLE REQUIREMENT
      ------------------------- */

      if (
        requiredRoles?.length &&
        !requiredRoles.some(
          (role) =>
            userRoles.includes(
              normalizeRole(role)
            )
        )
      ) {
        return false;
      }

      /* -------------------------
         ADMIN BYPASS
      ------------------------- */

      if (isAdmin()) {
        return true;
      }

      /* -------------------------
         PERMISSION
      ------------------------- */

      if (!permission) {
        return true;
      }

      return userPermissions.includes(
        permission
      );
    },
    [
      user,
      userRoles,
      userPermissions,
      isActiveMember,
      isAdmin,
    ]
  );

  return {
    /* -------------------------
       AUTHORIZATION
    ------------------------- */

    userRoles,
    userPermissions,

    /* -------------------------
       MEMBERSHIP
    ------------------------- */

    activeMembershipStatus,
    isActiveMember,
    isPendingMember,
    isSuspendedMember,

    /* -------------------------
       UTILITIES
    ------------------------- */

    isAdmin,
    hasRole,
    canUser,
  };
}
