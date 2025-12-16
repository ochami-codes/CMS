// src/utils/permissions.js
import { ROLE_PERMISSIONS } from "./roles";

export function canUser(role, permission) {
  if (role === "admin") return true;
  if (!permission) return true;
  return ROLE_PERMISSIONS[role]?.includes(permission);
}