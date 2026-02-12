import { auth } from "../firebase/auth.js";

/**
 * @fileoverview User authentication utilities.
 * Provides helper functions for:
 * - Refreshing and storing Firebase ID tokens
 * - Retrieving the UID of the currently authenticated user
 *
 * @module utils/authUtils
 */

/**
 * Refreshes the Firebase ID token and stores it in localStorage.
 *
 * @async
 * @function refreshTokenAndStore
 * @returns {Promise<void>} Resolves when the token is refreshed and stored.
 * @throws {Error} Logs an error if token refresh fails.
 *
 * @example
 * await refreshTokenAndStore();
 * const token = localStorage.getItem("token");
 * console.log(token); // refreshed Firebase ID token
 */
export async function refreshTokenAndStore() {
  const user = auth.currentUser;
  if (user) {
    try {
      const token = await user.getIdToken(true);
      localStorage.setItem("token", token);
    } catch (err) {
      console.error("Error refreshing token:", err);
    }
  }
}

/**
 * Retrieves the UID of the currently authenticated Firebase user.
 *
 * @function getCurrentUserUid
 * @returns {string|null} The UID of the authenticated user, or null if no user is logged in.
 *
 * @example
 * const uid = getCurrentUserUid();
 * if (uid) {
 *   console.log("Current user UID:", uid);
 * } else {
 *   console.log("No user logged in");
 * }
 */
export const getCurrentUserUid = () => {
  return auth.currentUser?.uid || null;
};
