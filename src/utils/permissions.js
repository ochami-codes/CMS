import { ROLE_PERMISSIONS } from "../config/roles";

export function canUser(role, permission) {
  if (role === "admin") return true;
  if (!permission) return true;
  return ROLE_PERMISSIONS[role]?.includes(permission);
}