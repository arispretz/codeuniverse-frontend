import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

/**
 * @fileoverview useAuth hook.
 * Provides a convenient way to access the authentication context throughout the application.
 * Returns user information, authentication status, role, MongoDB ID, and loading state.
 *
 * @module hooks/useAuth
 */

/**
 * Custom hook to access authentication context.
 *
 * @function useAuth
 * @returns {AuthContextValue} The current authentication context value.
 *
 * @example
 * import { useAuth } from '../hooks/useAuth';
 *
 * const Dashboard = () => {
 *   const { user, isAuthenticated, role, loading } = useAuth();
 *
 *   if (loading) return <p>Loading...</p>;
 *
 *   return (
 *     <div>
 *       {isAuthenticated ? (
 *         <h1>Welcome {user.displayName} ({role})</h1>
 *       ) : (
 *         <h1>Please log in</h1>
 *       )}
 *     </div>
 *   );
 * };
 */
export const useAuth = () => {
  return useContext(AuthContext);
};
