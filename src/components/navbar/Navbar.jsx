/**
 * @fileoverview Navbar component.
 * Provides the top navigation bar for the CodeUniverse platform.
 * Includes the logo, navigation dropdowns, theme toggle, and authentication buttons.
 *
 * @module components/navbar/Navbar
 */

import React from 'react';
import { AppBar, Toolbar, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import ThemeToggleButton from '../../ThemeToggleButton.jsx';
import Logo from '../Logo.jsx';
import { navDropdowns } from './NavDropdowns.js'; 
import NavCategory from './NavCategory.jsx';

/**
 * Navbar Component
 *
 * @function Navbar
 * @returns {JSX.Element} Responsive navigation bar with logo, navigation categories, and action buttons.
 *
 * @example
 * <Navbar />
 */
const Navbar = () => {
  const theme = useTheme();

  return (
    <AppBar
      position="static"
      sx={{
        width: '100vw',
        backgroundColor: theme.palette.navbar.background,
        color: theme.palette.navbar.text,
        boxShadow: 'none',
      }}
    >
      <Toolbar
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          px: 4,
          py: 2,
        }}
      >
        {/* Logo */}
        <Logo />

        {/* Navigation dropdowns */}
        <Box sx={{ display: 'flex', gap: 2 }} role="menubar"> 
          {Object.entries(navDropdowns).map(([category, items]) => ( 
            <NavCategory 
              key={category} 
              label={category} 
              items={items} 
            />
          ))} 
        </Box>

        {/* Action buttons */}
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button component={Link} to="/sign-in" variant="outlined" sx={buttonStyle}>
            Sign In
          </Button>
          <Button component={Link} to="/register" variant="outlined" sx={buttonStyle}>
            Sign Up
          </Button>
          <ThemeToggleButton />
        </Box>
      </Toolbar>
    </AppBar>
  );
};

/**
 * Button style configuration for authentication buttons.
 *
 * @constant
 * @type {Object}
 */
const buttonStyle = {
  color: '#00C4BE',
  borderColor: '#2e3b8eff',
  textTransform: 'none',
  '&:hover': {
    backgroundColor: '#f0f0f0',
    color: '#7A5299',
    transform: 'translateY(1px)',
    boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.2)',
  },
};

export default Navbar;
