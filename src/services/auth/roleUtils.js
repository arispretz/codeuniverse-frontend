import axios from 'axios';
import { auth } from '../../firebase/auth.js';

/**
 * @fileoverview Utilities for fetching user roles.
 * Provides functions to retrieve a user's role from the backend using a Firebase ID token.
 *
 * @module services/auth/roleUtils
 */

/**
 * Get user role from backend using ID token.
 *
 * @async
 * @function getUserRoleFromBackend
 * @param {string} idToken - Firebase ID token for the authenticated user.
 * @returns {Promise<string|null>} Resolves with the user's role (e.g., "admin", "manager", "developer") or null if request fails.
 *
 * @example
 * const idToken = await user.getIdToken();
 * const role = await getUserRoleFromBackend(idToken);
 * console.log(role); // "admin"
 */
export async function getUserRoleFromBackend(idToken) {
  try {
    const res = await axios.get('/api/users/me', {
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    });
    return res.data.role;
  } catch (err) {
    console.error('Error fetching user role from backend:', err);
    return null;
  }
}

/**
 * Fetch current user's role using Firebase ID token.
 *
 * @async
 * @function fetchCurrentUserRole
 * @returns {Promise<string|null>} Resolves with the current user's role or null if unauthenticated or request fails.
 *
 * @example
 * const role = await fetchCurrentUserRole();
 * if (role === 'admin') {
 *   navigate('/admin/dashboard');
 * }
 */
export async function fetchCurrentUserRole() {
  const user = auth.currentUser;
  if (!user) return null;

  try {
    const idToken = await user.getIdToken();
    const role = await getUserRoleFromBackend(idToken);
    return role;
  } catch (err) {
    console.error('Error fetching current user role:', err);
    return null;
  }
}
