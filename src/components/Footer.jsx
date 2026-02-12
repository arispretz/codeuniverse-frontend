/**
 * @fileoverview Footer component.
 * Provides the footer section for the CodeUniverse platform.
 * Displays navigation links, social icons, and metadata.
 * Supports light and dark themes via Material UI's theme context.
 *
 * @module components/Footer
 */

import React from 'react';
import { Box, Typography, Link as MuiLink } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub, faLinkedin, faFreeCodeCamp } from '@fortawesome/free-brands-svg-icons';
import { useTheme } from '@mui/material/styles';

/**
 * Footer Component
 *
 * @function Footer
 * @returns {JSX.Element} Footer section with navigation links, social icons, and metadata.
 *
 * @example
 * <Footer />
 */
const Footer = () => {
  const theme = useTheme();

  return (
    <Box
      component="footer"
      sx={{
        width: '100vw',
        backgroundColor: theme.palette.navbar.background,
        color: theme.palette.navbar.text,
        py: 4,
        px: 2,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 2,
        fontSize: '0.9rem',
      }}
    >
      {/* Navigation links */}
      <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap', justifyContent: 'center' }}>
        <MuiLink href="/privacy" underline="hover" sx={{ color: theme.palette.navbar.text }}>
          Privacy Policy
        </MuiLink>
        <MuiLink href="/terms" underline="hover" sx={{ color: theme.palette.navbar.text }}>
          Terms of Service
        </MuiLink>
        <MuiLink href="/contact" underline="hover" sx={{ color: theme.palette.navbar.text }}>
          Contact / Support
        </MuiLink>
      </Box>

      {/* Social icons */}
      <Box sx={{ display: 'flex', gap: 2 }}>
        <MuiLink href="https://github.com/arispretz/" target="_blank" rel="noopener noreferrer">
          <FontAwesomeIcon icon={faGithub} style={{ fontSize: '1.5rem' }} />
        </MuiLink>
        <MuiLink href="https://www.linkedin.com/in/ariana-carolina-spretz-369040120/" target="_blank" rel="noopener noreferrer">
          <FontAwesomeIcon icon={faLinkedin} style={{ fontSize: '1.5rem' }} />
        </MuiLink>
        <MuiLink href="https://www.freecodecamp.org/fcc97a4612c-ace6-4fb2-8584-c09b0a37bd6f" target="_blank" rel="noopener noreferrer">
          <FontAwesomeIcon icon={faFreeCodeCamp} style={{ fontSize: '1.5rem' }} />
        </MuiLink>
      </Box>

      {/* Metadata */}
      <Typography variant="body2" sx={{ opacity: 0.7, textAlign: 'center' }}>
        © {new Date().getFullYear()} codeuniverse. Made with ❤️ by Ariana Spretz
      </Typography>
    </Box>
  );
};

export default Footer;
