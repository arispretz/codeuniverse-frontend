import axios from "axios";

/**
 * @fileoverview User synchronization utility.
 * Synchronizes Firebase user with backend, registers if needed, and redirects based on role.
 * - Obtains Firebase ID token and stores it in localStorage.
 * - Fetches user data from backend (`/api/users/me`).
 * - Registers new user if not found (404).
 * - Updates React context with user and role.
 * - Redirects user to appropriate path based on role and navigation context.
 *
 * @module utils/syncUserAndRedirect
 */

const BASE_URL = import.meta.env.VITE_EXPRESS_URL;
if (!BASE_URL) {
  throw new Error("Missing environment variable: VITE_EXPRESS_URL");
}

/**
 * Synchronizes Firebase user with backend, registers if needed, and redirects based on role.
 *
 * @async
 * @function syncUserAndRedirect
 * @param {User} firebaseUser - Firebase authenticated user.
 * @param {Function} navigate - React Router navigation function.
 * @param {Function} setUser - Context setter for user (Firebase + backend info).
 * @param {Function} setRole - Context setter for role.
 * @param {string} fallbackPath - Path to redirect if no previous location is stored.
 * @param {string} [fromPath] - Optional original path user tried to access.
 * @returns {Promise<Object|null>} User document from backend (MongoDB) or null if sync fails.
 *
 * @example
 * const userData = await syncUserAndRedirect(firebaseUser, navigate, setUser, setRole, "/dashboard");
 * if (userData) {
 *   console.log("User synced:", userData);
 * }
 */
export async function syncUserAndRedirect(
  firebaseUser,
  navigate,
  setUser,
  setRole,
  fallbackPath,
  fromPath
) {
  try {
    // 🔑 Get Firebase ID token and store in localStorage
    const token = await firebaseUser.getIdToken(true);
    localStorage.setItem("token", token);

    let userData;
    try {
      // 📡 Try to fetch user from backend
      const res = await axios.get(`${BASE_URL}/api/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      userData = res.data;
    } catch (err) {
      // 🆕 Register user if not found
      if (err.response?.status === 404) {
        const registerRes = await axios.post(`${BASE_URL}/api/users`, {
          idToken: token,
          username: firebaseUser.displayName || firebaseUser.email,
          invitationCode: null,
        });
        userData = registerRes.data;
      } else {
        throw err;
      }
    }

    // ✅ Validate role
    if (!userData?.role || typeof userData.role !== "string") {
      throw new Error("Invalid role");
    }

    // 🧩 Update context with user and role
    setUser({ ...firebaseUser, role: userData.role });
    setRole(userData.role);

    // 🔀 Handle redirection logic
    const currentPath = window.location.pathname;
    const isAuthPage = ["/sign-in", "/register"].includes(currentPath);
    const redirectTarget = fromPath || (isAuthPage ? fallbackPath : null);

    if (redirectTarget) {
      navigate(redirectTarget, { replace: true });
    }

    return userData;
  } catch (err) {
    console.error("❌ Sync error:", err.message);
    setUser(null);
    setRole(null);
    localStorage.removeItem("token");
    return null;
  }
}
