import { useState, useCallback } from "react";
import { RolesAPI } from "../utils/api";
import { normalizeRole } from "../config/roles.js";

export function useAuthRoles(user) {
  const [rolesData, setRolesData] = useState({
    roles: [],
    roleLabels: {},
    requestableRoles: [],
    allRoles: [],
    allPermissions: [],
  });

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

  const isAdmin = useCallback(
    () => user?.roles?.includes("admin") ?? false,
    [user]
  );

  const hasRole = useCallback(
    (role) => user?.roles?.includes(normalizeRole(role)) ?? false,
    [user]
  );

  const canUser = useCallback(
    (permission, options = {}) => {
      if (!user) return false;

      const { roles, requireActiveMember = false } = options;

      if (requireActiveMember) {
        // NOTE: membership check will come later hook
        if (!user?.active_membership_status === "active") {
          return false;
        }
      }

      if (roles?.length) {
        const hasRoleMatch = roles.some((r) =>
          user.roles.includes(normalizeRole(r))
        );

        if (!hasRoleMatch) return false;
      }

      if (isAdmin()) return true;

      if (permission) {
        return user.permissions.includes(permission);
      }

      return true;
    },
    [user, isAdmin]
  );

  const getRoleLabel = useCallback(
    (role) => rolesData.roleLabels[normalizeRole(role)] || role,
    [rolesData]
  );

  return {
    rolesData,
    fetchRoles,
    isAdmin,
    hasRole,
    canUser,
    getRoleLabel,
  };
}
