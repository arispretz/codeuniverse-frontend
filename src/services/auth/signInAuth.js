import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase/auth.js';

/**
 * @fileoverview signIn utility.
 * Provides a wrapper around Firebase Authentication's `signInWithEmailAndPassword`.
 * Used to authenticate users with email and password credentials.
 *
 * @module services/auth/signInAuth
 */

/**
 * Sign in using Firebase authentication.
 *
 * @async
 * @function signIn
 * @param {string} email - User's email address.
 * @param {string} password - User's password.
 * @returns {User<Credential>} Resolves with the Firebase UserCredential object if authentication succeeds.
 *
 * @throws {Error} Throws an error if authentication fails (e.g., invalid credentials, network error).
 *
 * @example
 * import { signIn } from './utils/signIn';
 *
 * const handleLogin = async () => {
 *   try {
 *     const userCredential = await signIn('user@example.com', 'securePassword123');
 *     console.log('User signed in:', userCredential.user);
 *   } catch (err) {
 *     console.error('Login failed:', err.message);
 *   }
 * };
 */
export const signIn = (email, password) =>
  signInWithEmailAndPassword(auth, email, password);
