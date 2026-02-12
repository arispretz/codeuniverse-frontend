import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase/auth.js';

/**
 * @fileoverview signUp utility.
 * Provides a wrapper around Firebase Authentication's `createUserWithEmailAndPassword`.
 * Used to register new users with email and password credentials.
 *
 * @module services/auth/signUpAuth
 */

/**
 * Register a new user using Firebase authentication.
 *
 * @async
 * @function signUp
 * @param {string} email - New user's email address.
 * @param {string} password - New user's password.
 * @returns {User<Credential>} Resolves with the Firebase UserCredential object if registration succeeds.
 *
 * @throws {Error} Throws an error if registration fails (e.g., weak password, email already in use, network error).
 *
 * @example
 * import { signUp } from './utils/signUp';
 *
 * const handleRegister = async () => {
 *   try {
 *     const userCredential = await signUp('newuser@example.com', 'StrongPassword123');
 *     console.log('User registered:', userCredential.user);
 *   } catch (err) {
 *     console.error('Registration failed:', err.message);
 *   }
 * };
 */
export const signUp = (email, password) =>
  createUserWithEmailAndPassword(auth, email, password);
