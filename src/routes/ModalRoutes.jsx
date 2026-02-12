import React, { lazy } from 'react';

/**
 * @fileoverview ModalRoutes configuration.
 * Defines modal routes for rendering modal components based on path.
 * These routes are typically used in nested routing or portal-based modals.
 * Components are lazy-loaded to optimize performance.
 *
 * @module routes/ModalRoutes
 */

// Lazy-loaded modal components for performance optimization
const LogoutModal = lazy(() => import('../components/modals/LogoutModal'));

/**
 * ModalRoutes
 *
 * @constant
 * @type {RouteObject[]}
 * @description Route configuration for modal components.
 *
 * @example
 * import { ModalRoutes } from './routes/ModalRoutes';
 *
 * <Routes>
 *   {ModalRoutes.map((route, idx) => (
 *     <Route key={idx} path={route.path} element={route.element} />
 *   ))}
 * </Routes>
 */
export const ModalRoutes = [
  {
    path: 'logout',
    element: <LogoutModal />,
  },
];
