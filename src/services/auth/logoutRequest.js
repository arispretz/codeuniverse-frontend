import { signOut } from 'firebase/auth';
import { auth } from '../../firebase/auth.js';

/**
 * @fileoverview logoutRequest utility.
 * Handles signing out the current Firebase user.
 * - Invoca `signOut` de Firebase Auth.
 * - Muestra mensajes en consola para éxito o error.
 *
 * @module services/auth/logoutRequest
 */

/**
 * logoutRequest
 *
 * @async
 * @function logoutRequest
 * @returns {Promise<void>} Resolves when the user has been successfully signed out.
 *
 * @throws {Error} Throws an error if the sign-out process fails.
 *
 * @example
 * import { logoutRequest } from './utils/logoutRequest';
 *
 * const handleLogout = async () => {
 *   try {
 *     await logoutRequest();
 *     // Redirigir al usuario a la página de inicio
 *     navigate('/home');
 *   } catch (err) {
 *     console.error('Logout failed:', err);
 *   }
 * };
 */
export const logoutRequest = async () => {
  try {
    await signOut(auth);
    console.log('✅ User successfully logged out');
  } catch (error) {
    console.error('❌ Error while logging out:', error.message);
    throw error;
  }
};
