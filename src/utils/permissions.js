// src/utils/permissions.js
import { roles } from "./roles";

export function canUser(role, permission) {
  if (role === "admin") return true;
  if (!permission) return true;
  return roles[role]?.includes(permission);
}
