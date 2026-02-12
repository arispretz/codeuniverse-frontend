/**
 * @fileoverview Custom React hook that listens to Firebase Authentication state changes.
 * Retrieves the user's role from the backend and returns an enriched user object
 * with both Firebase properties and a `role` field.
 *
 * @module auth/useFirebaseAuth
 */

import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/auth.js";
import { fetchCurrentUserRole } from "../services/roleUtils.js";

/**
 * useFirebaseAuth hook.
 *
 * Manages Firebase authentication state and augments the authenticated user
 * with a role fetched from the backend. If no role is found or an error occurs,
 * defaults to `"GUEST"`.
 *
 * @function useFirebaseAuth
 * @returns {Object|null} The authenticated user object enriched with a `role` property,
 * or `null` if the user is not logged in.
 *
 * @example
 * const user = useFirebaseAuth();
 * if (user) {
 *   console.log(user.email, user.role);
 * }
 */
export const useFirebaseAuth = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          const role = await fetchCurrentUserRole();
          setUser({ ...firebaseUser, role: role || "GUEST" });
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Error fetching user role:", error);
        // Fallback role assignment in case of error
        setUser(firebaseUser ? { ...firebaseUser, role: "GUEST" } : null);
      }
    });

    // Cleanup listener on component unmount
    return () => unsubscribe();
  }, []);

  return user;
};
