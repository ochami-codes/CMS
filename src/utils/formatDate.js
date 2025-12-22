// src/utils/formatDate.js
/**
 * Format a date object or ISO string to a readable format.
 * Example: 2025-12-10T12:00:00 => Dec 10, 2025
 */
export const formatDate = (date, options = {}) => {
  if (!date) return "";
  const d = typeof date === "string" ? new Date(date) : date;
  // Default options
  const defaultOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };
  return d.toLocaleDateString("en-US", { ...defaultOptions, ...options });
};

/**
 * Format date and time
 * Example: Dec 10, 2025, 2:30 PM
 */
export const formatDateTime = (date, options = {}) => {
  if (!date) return "";
  const d = typeof date === "string" ? new Date(date) : date;
  const defaultOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  };
  return d.toLocaleString("en-US", { ...defaultOptions, ...options });
};