// src/utils/permissions.js
import { ROLE_PERMISSIONS } from "../config/roles";

const ADMIN_LIKE_ROLES = ["Admin"];

export function canUser(role, permission) {
  if (!role) return false;

  // Public / unprotected items
  if (!permission) return true;

  // Admin-like roles have all permissions
  if (ADMIN_LIKE_ROLES.includes(role)) return true;

  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
}

/* ---------- Role helpers for UI ---------- */
export const isAdmin = (role) =>
  ADMIN_LIKE_ROLES.includes(role);

export const hasRole = (role, roles = []) =>
  roles.includes(role);
