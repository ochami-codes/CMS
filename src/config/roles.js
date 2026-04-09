// ./config/roles.js

/**
 * Normalize role string to lowercase and trim spaces
 * Ensures consistent comparison across backend and frontend
 * @param {string} role
 * @returns {string} normalized role
 */
export const normalizeRole = (role) => {
  if (!role || typeof role !== "string") return "guest";
  return role.trim().toLowerCase();
};
