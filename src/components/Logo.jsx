/**
 * @fileoverview Logo component.
 * Provides a clickable logo that links to the homepage.
 * The logo height can be customized via props.
 *
 * @module components/Logo
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Box } from '@mui/material';
import { Link } from 'react-router-dom';
import logo from '../assets/images/logo.png';

/**
 * Logo Component
 *
 * @function Logo
 * @param {Object} props - Component props.
 * @param {number} [props.height=85] - Height of the logo image in pixels.
 * @returns {JSX.Element} A clickable logo that redirects to the homepage.
 *
 * @example
 * <Logo height={100} />
 */
const Logo = ({ height = 85 }) => {
  return (
    <Box
      component={Link}
      to="/"
      aria-label="Go to homepage"
      sx={{
        display: 'inline-block',
        cursor: 'pointer',
        lineHeight: 0,
      }}
    >
      <Box
        component="img"
        src={logo}
        alt="CodeUniverse logo"
        sx={{
          height,
          verticalAlign: 'middle',
        }}
      />
    </Box>
  );
};

Logo.propTypes = {
  /** Height of the logo image in pixels */
  height: PropTypes.number,
};

export default Logo;
