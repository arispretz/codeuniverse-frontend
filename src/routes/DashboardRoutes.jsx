/**
 * @fileoverview Dashboard routes configuration for protected access.
 * Provides lazy-loaded components and role-based route protection.
 * @module routes/DashboardRoutes
 */

import React, { lazy } from 'react';
import { ProtectedRoute } from './ProtectedRoute.jsx';
import PrivateLayout from '../layouts/PrivateLayout.jsx';

// Lazy-loaded route components
const Dashboard = lazy(() => import('../pages/Dashboard'));
const MyProjects = lazy(() => import('../pages/MyProjects'));
const KanbanBoard = lazy(() => import('../pages/KanbanBoard'));
const TeamChatModule = lazy(() => import('../pages/TeamChatModule'));
const Settings = lazy(() => import('../pages/Settings'));
const Profile = lazy(() => import('../pages/Profile'));
const ProjectDashboard = lazy(() => import('../pages/ProjectDashboard'));
const CollaborativeCodeEditor = lazy(() => import('../pages/CollaborativeCodeEditor'));
const ProjectManagementDashboard = lazy(() => import('../pages/ProjectManagementDashboard'));
const ProjectDocumentation = lazy(() => import('../pages/ProjectDocumentation'));
const PersonalTaskBoard = lazy(() => import('../pages/PersonalTaskBoard'));
const LocalTaskBoard = lazy(() => import('../pages/LocalTaskBoard'));
const TasksPage = lazy(() => import('../pages/TasksPage'));
const CodeReviewPanel = lazy(() => import('../pages/CodeReviewPanel'));
const ProjectSelector = lazy(() => import('../components/ProjectSelector'));
const AdminUserPanel = lazy(() => import("../pages/AdminUserPanel"));
const QuickStartGuide = lazy(() => import("../pages/docs/QuickStartGuide"));

// Validate environment variable for allowed roles
const allowedRolesEnv = import.meta.env.VITE_DASHBOARD_ALLOWED_ROLES;
if (!allowedRolesEnv) {
  throw new Error("❌ Environment variable VITE_DASHBOARD_ALLOWED_ROLES must be defined");
}
const allowedRoles = allowedRolesEnv.split(',').map(r => r.trim());

/**
 * DashboardRoutes configuration.
 *
 * @constant
 * @type {Array<Object>}
 * @property {string} path - Route path.
 * @property {JSX.Element} element - Protected route wrapper with layout.
 * @property {Array<Object>} children - Nested routes with role-based access.
 */
export const DashboardRoutes = [
  {
    path: 'dashboard',
    element: (
      <ProtectedRoute allowedRoles={allowedRoles}>
        <PrivateLayout />
      </ProtectedRoute>
    ),
    children: [
      // Common routes
      { index: true, element: <Dashboard /> },
      { path: 'my-projects', element: <MyProjects /> },
      { path: 'team-chat', element: <TeamChatModule /> },
      { path: 'settings', element: <Settings /> },
      { path: 'profile', element: <Profile /> },
      { path: 'project-docs', element: <ProjectDocumentation /> },
      { path: 'code-review', element: <CodeReviewPanel /> },
      { path: 'editor', element: <ProjectSelector /> },
      { path: 'projects/:id/editor', element: <CollaborativeCodeEditor /> },

      // Admin routes
      { path: "admin-user-panel", element: <AdminUserPanel /> },

      // Developer routes
      { path: 'personal-tasks', element: <PersonalTaskBoard /> },
      { path: 'local-task-board', element: <LocalTaskBoard /> },
      { path: 'kanban', element: <KanbanBoard /> },

      // Manager routes
      { path: 'project-dashboard', element: <ProjectDashboard /> },
      { path: 'manager/projects', element: <ProjectManagementDashboard /> },

      // Guest routes
      { path: 'quick-start-guide', element: <QuickStartGuide /> },

      // Project-specific routes
      { path: 'projects/:id', element: <TasksPage /> },
      { path: 'projects/:id/kanban', element: <KanbanBoard /> },
      { path: 'projects/:id/local-tasks', element: <LocalTaskBoard /> },
      { path: 'projects/:id/lists/:listId/tasks', element: <TasksPage /> },
      { path: 'projects/:id/lists/:listId/local-tasks', element: <LocalTaskBoard /> },
      { path: 'projects/:id/lists/:listId/kanban', element: <KanbanBoard /> },
    ],
  },
];
