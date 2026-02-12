import {
  getAuth,
  GoogleAuthProvider,
  GithubAuthProvider,
  setPersistence,
  browserLocalPersistence,
} from 'firebase/auth';
import { app } from '../hooks/init.js';

/**
 * @fileoverview Firebase authentication setup.
 * Initializes Firebase Auth instance, configures persistence, and exports
 * authentication providers (Google, GitHub).
 *
 * @module firebase/auth
 */

/**
 * Firebase Auth instance.
 *
 * @constant
 * @type {Object}
 *
 * @example
 * import { auth } from './firebase/auth';
 * auth.signInWithRedirect(googleProvider);
 */
const auth = getAuth(app);

/**
 * Sets local persistence for authentication.
 * Ensures that the user's session persists across browser reloads.
 *
 * @async
 * @function setPersistence
 * @returns {Promise<void>} Resolves when persistence is successfully set.
 */
setPersistence(auth, browserLocalPersistence).catch((error) => {
  console.error('❌ Failed to set auth persistence:', error);
});

/**
 * Google authentication provider.
 *
 * @constant
 * @type {GoogleAuthProvider}
 *
 * @example
 * import { googleProvider } from './firebase/auth';
 * auth.signInWithRedirect(googleProvider);
 */
const googleProvider = new GoogleAuthProvider();

/**
 * GitHub authentication provider.
 *
 * @constant
 * @type {GithubAuthProvider}
 *
 * @example
 * import { githubProvider } from './firebase/auth';
 * auth.signInWithRedirect(githubProvider);
 */
const githubProvider = new GithubAuthProvider();

export { auth, googleProvider, githubProvider };
