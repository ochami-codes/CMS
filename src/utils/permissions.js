// src/utils/permissions.js
import { ROLE_PERMISSIONS } from "../config/roles";

export function canUser(role, permission) {
  if (!role || !permission) return false;

  // Admin has all permissions
  if (role === "Admin") return true;

  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
}
