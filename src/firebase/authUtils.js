import {
  signInWithRedirect,
  getRedirectResult,
  signOut,
  onAuthStateChanged,
  signInWithEmailAndPassword,
} from 'firebase/auth';

/**
 * @fileoverview Firebase authentication utility functions.
 * Provides wrappers and re-exports for common Firebase Auth methods:
 * - Redirect sign-in
 * - Handling redirect results
 * - Sign-out
 * - Observing auth state changes
 * - Email/password sign-in
 *
 * @module firebase/authUtils
 */

/**
 * Redirects user to sign in with a provider.
 *
 * @function signInWithRedirect
 * @see {@link https://firebase.google.com/docs/auth/web/redirect}
 * @example
 * import { auth } from './firebase/auth';
 * import { googleProvider } from './firebase/auth';
 * import { signInWithRedirect } from './firebase/authUtils';
 *
 * signInWithRedirect(auth, googleProvider);
 */
export { signInWithRedirect };

/**
 * Retrieves the result from a redirect sign-in.
 *
 * @function getRedirectResult
 * @example
 * import { auth } from './firebase/auth';
 * import { getRedirectResult } from './firebase/authUtils';
 *
 * const result = await getRedirectResult(auth);
 * if (result?.user) {
 *   console.log("User signed in:", result.user);
 * }
 */
export { getRedirectResult };

/**
 * Signs out the current user.
 *
 * @function signOut
 * @example
 * import { auth } from './firebase/auth';
 * import { signOut } from './firebase/authUtils';
 *
 * await signOut(auth);
 */
export { signOut };

/**
 * Observes changes in the user's sign-in state.
 *
 * @function onAuthStateChanged
 * @example
 * import { auth } from './firebase/auth';
 * import { onAuthStateChanged } from './firebase/authUtils';
 *
 * onAuthStateChanged(auth, (user) => {
 *   if (user) {
 *     console.log("User is signed in:", user);
 *   } else {
 *     console.log("User is signed out");
 *   }
 * });
 */
export { onAuthStateChanged };

/**
 * Signs in the current user with email and password.
 *
 * @function signInWithEmailAndPassword
 * @example
 * import { auth } from './firebase/auth';
 * import { signInWithEmailAndPassword } from './firebase/authUtils';
 *
 * await signInWithEmailAndPassword(auth, "user@example.com", "password123");
 */
export { signInWithEmailAndPassword };
