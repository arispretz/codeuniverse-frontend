import { getAuth, onIdTokenChanged } from "firebase/auth";
import { app } from "../hooks/init.js";

const auth = getAuth(app);

let cachedToken = null;

/**
 * @fileoverview Firebase authentication token utilities.
 * Provides:
 * - Listener for Firebase ID token changes (keeps a cached token updated).
 * - Function to retrieve a valid Firebase ID token, with optional forced refresh.
 *
 * @module utils/userToken
 */

/**
 * Listener for Firebase ID token changes.
 * Updates the cached token whenever the user signs in, signs out, or refreshes.
 *
 * @event onIdTokenChanged
 * @param {User|null} user - Firebase user object or null if signed out.
 *
 * @example
 * // This listener runs automatically when user state changes:
 * onIdTokenChanged(auth, async (user) => {
 *   if (user) {
 *     cachedToken = await user.getIdToken();
 *   }
 * });
 */
onIdTokenChanged(auth, async (user) => {
  if (user) {
    try {
      cachedToken = await user.getIdToken();
    } catch (err) {
      console.error("❌ Failed to update cached token:", err.message);
      cachedToken = null;
    }
  } else {
    cachedToken = null;
  }
});

/**
 * Retrieves a valid Firebase ID token for the authenticated user.
 *
 * @async
 * @function getUserToken
 * @param {boolean} [forceRefresh=false] - Whether to force a token refresh.
 * @returns {Promise<string|null>} A valid ID token or null if no user is authenticated.
 *
 * @example
 * const token = await getUserToken();
 * if (token) {
 *   console.log("Firebase ID token:", token);
 * } else {
 *   console.log("No authenticated user");
 * }
 */
export async function getUserToken(forceRefresh = false) {
  const user = auth.currentUser;
  if (!user) {
    console.warn("⚠️ No authenticated user found");
    return null;
  }
  try {
    const token = await user.getIdToken(forceRefresh);
    cachedToken = token;
    return token;
  } catch (error) {
    console.error("❌ Failed to retrieve token:", error.message);
    return null;
  }
}
