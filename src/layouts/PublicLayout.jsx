/**
 * @fileoverview PublicLayout component.
 * Provides the main layout for pages accessible without authentication.
 * Includes:
 * - Navbar at the top
 * - Dynamic content area rendered via React Router Outlet
 * - Footer at the bottom
 *
 * @module layouts/PublicLayout
 */

import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/navbar/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import { Toolbar, Box } from "@mui/material";

/**
 * PublicLayout Component
 *
 * @function PublicLayout
 * @returns {JSX.Element} Public layout with navigation and footer.
 *
 * @example
 * // Usage in App.jsx
 * import PublicLayout from "./layout/PublicLayout";
 *
 * function App() {
 *   return (
 *     <Routes>
 *       <Route element={<PublicLayout />}>
 *         <Route path="/about" element={<AboutPage />} />
 *         <Route path="/contact" element={<ContactPage />} />
 *       </Route>
 *     </Routes>
 *   );
 * }
 */
const PublicLayout = () => {
  return (
    <Box component="main" role="main">
      {/* Navbar at the top */}
      <Navbar />

      {/* Spacer to offset fixed Navbar height */}
      <Toolbar sx={{ minHeight: 55 }} aria-hidden="true" />

      {/* Dynamic content rendered via React Router Outlet */}
      <Outlet />

      {/* Footer at the bottom */}
      <Footer />
    </Box>
  );
};

export default PublicLayout;
