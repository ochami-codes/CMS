// src/utils/permissions.js
import { ROLE_PERMISSIONS } from "../config/roles";

// ✅ normalized to match DB
const ADMIN_LIKE_ROLES = ["admin"];

export function canUser(role, permission) {
  if (!role) return false;

  const normalizedRole = role.toLowerCase();

  // Public / unprotected items (kept as-is)
  if (!permission) return true;

  // Admin-like roles have all permissions
  if (ADMIN_LIKE_ROLES.includes(normalizedRole)) return true;

  return ROLE_PERMISSIONS[normalizedRole]?.includes(permission) ?? false;
}

/* ---------- Role helpers for UI ---------- */
export const isAdmin = (role) =>
  ADMIN_LIKE_ROLES.includes(role?.toLowerCase());

export const hasRole = (role, roles = []) =>
  roles.map(r => r.toLowerCase()).includes(role?.toLowerCase());
