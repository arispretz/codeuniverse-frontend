import { auth } from '../../firebase/auth.js';
import { syncUserAndRedirect } from './syncUserAndRedirect.js';

/**
 * @fileoverview handleLoginRedirect utility.
 * Handles login redirect after Firebase authentication.
 * - Obtiene el usuario autenticado desde Firebase.
 * - Sincroniza los datos del usuario con el backend.
 * - Redirige al dashboard correspondiente según el rol.
 *
 * @module services/auth/handleLoginRedirect
 */

/**
 * Handle login redirect after authentication.
 *
 * @async
 * @function handleLoginRedirect
 * @param {Function} navigate - React Router navigate function used to redirect the user.
 * @param {Function} setUser - State setter for updating the authenticated user in local state.
 * @param {Function} setRole - State setter for updating the user's role in local state.
 * @returns {Promise<void>} Resolves when the user has been synced and redirected.
 *
 * @example
 * import { handleLoginRedirect } from './utils/handleLoginRedirect';
 *
 * // Dentro de un efecto en React
 * useEffect(() => {
 *   handleLoginRedirect(navigate, setUser, setRole);
 * }, []);
 */
export async function handleLoginRedirect(navigate, setUser, setRole) {
  const user = auth.currentUser;
  if (user) {
    await syncUserAndRedirect(user, navigate, setUser, setRole);
  }
}
