/**
 * @fileoverview RootLayout component.
 * Determines whether to render the PublicLayout or PrivateLayout depending on:
 * - Authentication status
 * - Current route (`/dashboard` for private routes)
 * - User role authorization
 *
 * Includes:
 * - Loading state with spinner until synchronization is complete
 * - Redirect to `/demo` if user is authenticated but lacks required role
 *
 * @module layouts/RootLayout
 */

import React from "react";
import { Outlet, useLocation, Navigate } from "react-router-dom";
import PublicLayout from "./PublicLayout.jsx";
import PrivateLayout from "./PrivateLayout.jsx";
import { useUser } from "../hooks/useUser.jsx";
import { Box, CircularProgress } from "@mui/material";

/**
 * RootLayout Component
 *
 * @function RootLayout
 * @returns {JSX.Element} Layout wrapper for routing.
 *
 * @example
 * // Usage in App.jsx
 * import RootLayout from "./layout/RootLayout";
 *
 * function App() {
 *   return (
 *     <Routes>
 *       <Route element={<RootLayout />}>
 *         <Route path="/dashboard/*" element={<Dashboard />} />
 *         <Route path="/about" element={<AboutPage />} />
 *       </Route>
 *     </Routes>
 *   );
 * }
 */
const RootLayout = () => {
  const { isAuthenticated, loading, user, role } = useUser();
  const { pathname } = useLocation();

  // Check if current route is private (dashboard-related)
  const isPrivateRoute = pathname.startsWith("/dashboard");

  // Roles allowed to access private routes
  const allowedRoles = ["admin", "guest", "developer", "manager", "ai_assistant"];
  const hasAccess = role && allowedRoles.includes(role);

  // ⏳ Show loading spinner until synchronization is complete
  if (loading || (isPrivateRoute && !role)) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
        <CircularProgress aria-label="Loading layout" />
      </Box>
    );
  }

  // 🔐 Authorized access: render private layout
  if (isPrivateRoute && isAuthenticated) {
    return (
      <PrivateLayout user={user}>
        <Outlet />
      </PrivateLayout>
    );
  }

  // 🚫 Access denied: redirect authenticated users without role to demo page
  if (isPrivateRoute && isAuthenticated && !hasAccess) {
    return <Navigate to="/demo" replace />;
  }

  // 🌐 Default: render public layout
  return (
    <PublicLayout>
      <Outlet />
    </PublicLayout>
  );
};

export default RootLayout;
