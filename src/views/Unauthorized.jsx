import React from 'react';
import { Box, Typography } from '@mui/material';

/**
 * @fileoverview Unauthorized component.
 * Displays an access denied message for unauthorized users.
 * Typically shown when a user tries to access a restricted route.
 *
 * @module views/unauthorized
 * @component 
 * @returns {JSX.Element} A styled message indicating lack of access permissions.
 *
 * @example
 * // Usage in a protected route
 * function ProtectedPage() {
 *   const hasAccess = false;
 *   return hasAccess ? <Dashboard /> : <Unauthorized />;
 * }
 */
const Unauthorized = () => (
  <Box sx={{ textAlign: 'center', mt: 10 }}>
    <Typography variant="h3" gutterBottom>
      ⛔ Access Denied
    </Typography>
    <Typography variant="body1">
      You do not have permission to view this section. Please contact the administrator if you believe this is a mistake.
    </Typography>
  </Box>
);

export default Unauthorized;
