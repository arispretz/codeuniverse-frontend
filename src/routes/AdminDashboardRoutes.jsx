import React, { lazy } from "react";
import { AdminRoutes } from "./AdminRoutes.jsx";
import PrivateLayout from "../layouts/PrivateLayout.jsx";

/**
 * @fileoverview AdminDashboardRoutes configuration.
 * Defines all routes for the admin dashboard, wrapped with `AdminRoutes` for role-based access
 * and `PrivateLayout` for authenticated layout.
 *
 * @module routes/AdminDashboardRoutes
 */

// Lazy-loaded admin components for better performance
const ProjectManagementDashboard = lazy(() => import("../pages/ProjectManagementDashboard"));
const Dashboard = lazy(() => import("../pages/Dashboard"));
const KanbanBoard = lazy(() => import("../pages/KanbanBoard"));
const TeamChatModule = lazy(() => import("../pages/TeamChatModule"));
const Settings = lazy(() => import("../pages/Settings"));
const ProjectDashboard = lazy(() => import("../pages/ProjectDashboard"));
const CollaborativeCodeEditor = lazy(() => import("../pages/CollaborativeCodeEditor"));
const ProjectDocumentation = lazy(() => import("../pages/ProjectDocumentation"));
const AdminUserPanel = lazy(() => import("../pages/AdminUserPanel"));

/**
 * AdminDashboardRoutes
 *
 * @constant
 * @type {Array<Object>}
 * @description Route configuration for admin dashboard pages.
 *
 * @example
 * import { AdminDashboardRoutes } from "./routes/AdminDashboardRoutes";
 *
 * <Routes>
 *   {AdminDashboardRoutes.map((route, idx) => (
 *     <Route key={idx} path={route.path} element={route.element}>
 *       {route.children?.map((child, i) => (
 *         <Route key={i} path={child.path} element={child.element} />
 *       ))}
 *     </Route>
 *   ))}
 * </Routes>
 */
export const AdminDashboardRoutes = [
  {
    path: "admin",
    element: (
      <AdminRoutes>
        <PrivateLayout />
      </AdminRoutes>
    ),
    children: [
      { path: "dashboard", element: <Dashboard /> },
      { path: "kanban", element: <KanbanBoard /> },
      { path: "team-chat", element: <TeamChatModule /> },
      { path: "settings", element: <Settings /> },
      { path: "project-dashboard", element: <ProjectDashboard /> },
      { path: "editor", element: <CollaborativeCodeEditor /> },
      { path: "manager/projects", element: <ProjectManagementDashboard /> },
      { path: "project-docs", element: <ProjectDocumentation /> },
      { path: "admin-user-panel", element: <AdminUserPanel /> },
    ],
  },
];
