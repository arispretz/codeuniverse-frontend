/**
 * @fileoverview Role-based redirect utility.
 * Provides a mapping between user roles and their corresponding redirect paths.
 * Used after login or for role-based navigation in the application.
 *
 * @module utils/getRedirectForRole
 */

/**
 * Maps user roles to their corresponding redirect paths.
 *
 * @constant
 * @type {Record<string, string>}
 *
 * @example
 * console.log(roleRedirects.admin); // "/admin-user-panel"
 */
const roleRedirects = {
  admin: "/admin-user-panel",
  manager: "/dashboard",
  developer: "/dashboard",
  ai_assistant: "/dashboard/chat",
  guest: "/demo",
};

/**
 * Returns the redirect path for a given user role.
 * Defaults to `/dashboard` if role is unknown or undefined.
 *
 * @function getRedirectForRole
 * @param {string} role - User role (e.g., "admin", "developer", "guest").
 * @returns {string} Redirect path corresponding to the role.
 *
 * @example
 * getRedirectForRole("admin"); // "/admin-user-panel"
 * getRedirectForRole("guest"); // "/demo"
 * getRedirectForRole("unknown"); // "/dashboard"
 */
export const getRedirectForRole = (role) => {
  if (!role || typeof role !== "string") return "/dashboard";
  const normalized = role.trim().toLowerCase();
  return roleRedirects[normalized] || "/dashboard";
};
