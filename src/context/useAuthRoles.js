import { useMemo, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";

import { RolesAPI } from "../utils/api";
import { normalizeRole } from "../config/roles";

export function useAuthRoles(user) {
  /* -------------------------
     Available Roles
  ------------------------- */

  const {
    data: roles = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["roles"],

    queryFn: async () => {
      const { roles = [] } =
        await RolesAPI.getAll();

      return roles.map((role) => ({
        name:
          normalizeRole(role.name),

        label:
          role.label ?? role.name,

        permissions:
          role.permissions ?? [],

        requestable:
          role.requestable ?? false,
      }));
    },

    enabled: !!user,

    staleTime:
      1000 * 60 * 10,
  });

  /* -------------------------
     Active Church Authorization
  ------------------------- */

  const activeChurch =
    user?.activeChurch ?? null;

  const userRoles =
    activeChurch?.roles ?? [];

  const userPermissions =
    activeChurch?.permissions ?? [];

  /* -------------------------
     Active Membership State
  ------------------------- */

  const activeMembershipStatus =
    user?.activeMembershipStatus ??
    "none";

  const isActiveMember =
    user?.isMember ?? false;

  const isPendingMember =
    user?.isPending ?? false;

  const isSuspendedMember =
    user?.isSuspended ?? false;

  /* -------------------------
     Role Metadata
  ------------------------- */

  const roleLabels = useMemo(
    () =>
      Object.fromEntries(
        roles.map((role) => [
          role.name,
          role.label,
        ])
      ),
    [roles]
  );

  const requestableRoles = useMemo(
    () =>
      roles
        .filter(
          (role) => role.requestable
        )
        .map(
          (role) => role.name
        ),
    [roles]
  );

  const allRoles = useMemo(
    () =>
      roles.map(
        (role) => role.name
      ),
    [roles]
  );

  const allPermissions = useMemo(
    () => [
      ...new Set(
        roles.flatMap(
          (role) =>
            role.permissions
        )
      ),
    ],
    [roles]
  );

  const rolesData = useMemo(
    () => ({
      roles,
      roleLabels,
      requestableRoles,
      allRoles,
      allPermissions,
    }),
    [
      roles,
      roleLabels,
      requestableRoles,
      allRoles,
      allPermissions,
    ]
  );

  /* -------------------------
     Role Checks
  ------------------------- */

  const isAdmin = useCallback(
    () =>
      userRoles.includes(
        "admin"
      ),
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
     Permission Check
  ------------------------- */

  const canUser = useCallback(
    (
      permission,
      options = {}
    ) => {
      // No authenticated user
      if (!user) {
        return false;
      }

      const {
        roles: requiredRoles,
        requireActiveMember = false,
      } = options;

      /* -------------------------
         Require Active Membership
      ------------------------- */

      if (
        requireActiveMember &&
        !isActiveMember
      ) {
        return false;
      }

      /* -------------------------
         Require Specific Roles
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
         Admin Bypass
      ------------------------- */

      if (isAdmin()) {
        return true;
      }

      /* -------------------------
         Permission Check
      ------------------------- */

      return permission
        ? userPermissions.includes(
            permission
          )
        : true;
    },
    [
      user,
      userRoles,
      userPermissions,
      isActiveMember,
      isAdmin,
    ]
  );

  /* -------------------------
     Role Label
  ------------------------- */

  const getRoleLabel =
    useCallback(
      (role) =>
        roleLabels[
          normalizeRole(role)
        ] ?? role,
      [roleLabels]
    );

  return {
    /* -------------------------
       Available Role Definitions
    ------------------------- */

    rolesData,

    /* -------------------------
       Query State
    ------------------------- */

    isLoading,
    error,
    refetch,

    /* -------------------------
       Active Church Authorization
    ------------------------- */

    userRoles,
    userPermissions,

    /* -------------------------
       Active Membership
    ------------------------- */

    activeMembershipStatus,
    isActiveMember,
    isPendingMember,
    isSuspendedMember,

    /* -------------------------
       Utilities
    ------------------------- */

    isAdmin,
    hasRole,
    canUser,
    getRoleLabel,
  };
}
