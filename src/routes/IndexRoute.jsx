import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useUser } from '../hooks/useUser.jsx';
import { getRedirectForRole } from '../utils/getRedirectForRole.js';
import Home from '../pages/public/Home.jsx';
import Loading from '../components/Loading.jsx';
import { Roles } from '../auth/roles.jsx';

/**
 * @fileoverview IndexRoute component.
 * Handles the root route (`/`) logic:
 * - Shows a loading spinner while authentication state is being resolved.
 * - Renders the Home page if unauthenticated or role is invalid.
 * - Redirects authenticated users to the appropriate dashboard based on their role.
 *
 * @module routes/IndexRoute
 */

/**
 * IndexRoute Component
 *
 * @function IndexRoute
 * @returns {JSX.Element|null} Redirect, Home page, Loading spinner, or null if not on root path.
 *
 * @example
 * import { IndexRoute } from './routes/IndexRoute';
 *
 * <Route path="/" element={<IndexRoute />} />
 */
export function IndexRoute() {
  const { role, loading, isAuthenticated } = useUser();
  const location = useLocation();

  // Only handle root path
  if (location.pathname !== '/') return null;

  // ⏳ Show loading spinner while authentication state is being resolved
  if (loading) return <Loading />;

  // 🚫 Render Home if unauthenticated
  if (!isAuthenticated) return <Home />;

  // Validate role
  const validRoles = Object.values(Roles);
  if (!validRoles.includes(role)) return <Home />;

  // 🔐 Redirect authenticated user to role-specific dashboard
  const redirectPath = getRedirectForRole(role);
  return <Navigate to={redirectPath} replace />;
}
