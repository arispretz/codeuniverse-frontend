import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useUser } from '../hooks/useUser.jsx';
import { CircularProgress, Box } from '@mui/material';

/**
 * @fileoverview ProtectedRoute component.
 * Restricts access to child components based on user authentication and role.
 * - Shows a full-screen spinner while authentication state is loading.
 * - Redirects unauthenticated users to `/sign-in`.
 * - Redirects authenticated users without the required role to `/unauthorized`.
 *
 * @module routes/ProtectedRoute
 */

/**
 * FullScreenSpinner Component
 *
 * @function FullScreenSpinner
 * @returns {JSX.Element} A centered loading spinner covering the entire viewport.
 *
 * @example
 * <FullScreenSpinner />
 */
export const FullScreenSpinner = () => (
  <Box
    sx={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
    }}
  >
    <CircularProgress />
  </Box>
);

/**
 * ProtectedRoute Component
 *
 * @function ProtectedRoute
 * @param {Object} props - Component props.
 * @param {React.ReactNode} props.children - Components to render if access is granted.
 * @param {string[]} [props.allowedRoles=[]] - List of allowed roles (case-insensitive).
 * @returns {JSX.Element} Either the protected content, a loading spinner, or a redirect.
 *
 * @example
 * import { ProtectedRoute } from './routes/ProtectedRoute';
 *
 * <Route
 *   path="/dashboard"
 *   element={
 *     <ProtectedRoute allowedRoles={['admin', 'manager']}>
 *       <Dashboard />
 *     </ProtectedRoute>
 *   }
 * />
 */
export const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, role, loading, isAuthenticated } = useUser();
  const location = useLocation();

  // ⏳ Show spinner while authentication state is loading or role is not yet available
  if (loading || !role) return <FullScreenSpinner />;

  // 🚫 Redirect unauthenticated users to sign-in
  if (!isAuthenticated) {
    return <Navigate to="/sign-in" state={{ from: location }} replace />;
  }

  // Normalize role for case-insensitive comparison
  const normalizedRole = role.toLowerCase();
  const hasAccess =
    allowedRoles.length === 0 ||
    allowedRoles.map((r) => r.toLowerCase()).includes(normalizedRole);

  // 🚫 Redirect if user does not have required role
  if (!hasAccess) return <Navigate to="/unauthorized" replace />;

  // ✅ Render protected content, injecting user prop into child
  return React.cloneElement(children, { user });
};
