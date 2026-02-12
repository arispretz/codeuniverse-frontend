/**
 * @fileoverview NotFound component.
 * Displays a 404 error page with a message and a button to return to the homepage.
 *
 * @module pages/NotFound
 */

import React from "react";
import {
  Container,
  Typography,
  Button,
  Box,
  useTheme,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

/**
 * NotFound component.
 * Renders a simple 404 error page with navigation back to the homepage.
 *
 * @function NotFound
 * @returns {JSX.Element} NotFound page layout
 */
const NotFound = () => {
  const theme = useTheme();
  const textColor = theme.palette.text.primary;
  const navigate = useNavigate();

  return (
    <Container maxWidth="sm" sx={{ py: 10, textAlign: "center" }}>
      <Box>
        <Typography variant="h1" color={textColor} sx={{ fontWeight: 700 }}>
          404
        </Typography>
        <Typography variant="h5" color="text.secondary" gutterBottom>
          Page not found
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Oops... the page you’re looking for doesn’t exist or may have been moved.
        </Typography>
        <Button variant="contained" onClick={() => navigate("/")}>
          Return to Homepage
        </Button>
      </Box>
    </Container>
  );
};

export default NotFound;
