import React from 'react';
import RootLayout from '../layouts/RootLayout.jsx';
import { PublicRoutes } from './PublicRoutes.jsx';
import { DashboardRoutes } from './DashboardRoutes.jsx';
import { ModalRoutes } from './ModalRoutes.jsx';
import NotFound from '../pages/NotFound.jsx';
import Unauthorized from '../views/Unauthorized.jsx';
import RedirectHandler from '../components/RedirectHandler.jsx';
import { AdminDashboardRoutes } from './AdminDashboardRoutes.jsx';

/**
 * @fileoverview Main application routes configuration.
 * Defines the root-level routes for the application:
 * - Public pages
 * - Protected dashboards (admin, manager, developer)
 * - Documentation routes
 * - Modal routes
 * - Admin panel routes
 * - Fallback routes for unauthorized access and 404 errors
 *
 * @module routes/Routes
 */

/**
 * routes
 *
 * @constant
 * @type {RouteObject[]}
 * @description Main route configuration array for the application.
 *
 * @example
 * import { routes } from './routes';
 *
 * <Routes>
 *   {routes.map((route, idx) => (
 *     <Route key={idx} path={route.path} element={route.element}>
 *       {route.children?.map((child, i) => (
 *         <Route key={i} path={child.path} element={child.element} />
 *       ))}
 *     </Route>
 *   ))}
 * </Routes>
 */
export const routes = [
  {
    path: '/',
    element: <RootLayout />,
    children: [
      // Public routes (marketing, auth, docs)
      ...PublicRoutes,

      // Protected dashboard routes (admin, manager, developer)
      ...DashboardRoutes,

      // Admin-specific dashboard routes
      ...AdminDashboardRoutes,

      // Redirect handler (used for OAuth or external redirects)
      {
        path: '/redirect',
        element: <RedirectHandler />,
      },

      // Modal routes (nested under /modal)
      {
        path: 'modal',
        children: ModalRoutes,
      },

      // Unauthorized access page
      { path: 'unauthorized', element: <Unauthorized /> },

      // Catch-all route for 404 Not Found
      { path: '*', element: <NotFound /> },
    ],
  },
];
