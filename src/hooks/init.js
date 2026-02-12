import { initializeApp } from 'firebase/app';
import {
  getAuth,
  setPersistence,
  browserLocalPersistence,
} from 'firebase/auth';

/**
 * @fileoverview Firebase initialization module.
 * Initializes the Firebase application using environment variables and
 * configures authentication persistence to survive browser reloads.
 *
 * @module hooks/init
 */

/**
 * Firebase configuration object sourced from environment variables.
 *
 * @constant
 * @type {Object}
 * @property {string} apiKey - Firebase API key.
 * @property {string} authDomain - Firebase Auth domain.
 * @property {string} projectId - Firebase project ID.
 * @property {string} appId - Firebase App ID.
 *
 * @example
 * const firebaseConfig = {
 *   apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
 *   authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
 *   projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
 *   appId: import.meta.env.VITE_FIREBASE_APP_ID,
 * };
 */
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

let app;
let auth;

/**
 * Initializes Firebase app instance and configures authentication persistence.
 *
 * @constant
 * @type {FirebaseApp}
 *
 * @example
 * import { app, auth } from './firebase/init';
 *
 * console.log(app.name); // Default Firebase app name
 */
try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);

  setPersistence(auth, browserLocalPersistence)
    .then(() => {
      console.log('🔒 Session persistence configured successfully');
    })
    .catch((error) => {
      console.error('❌ Error configuring persistence:', error.message);
    });
} catch (error) {
  console.error('❌ Firebase initialization failed:', error);
}

export { app, auth };
