/**
 * @fileoverview AuthProviderButton component.
 * Provides a styled authentication button for third-party providers (Google, GitHub).
 * The button automatically adjusts its label depending on the current route
 * (`/sign-in`, `/register`, or other).
 *
 * @module components/AuthProviderButton
 */

import React from 'react';
import { Button } from '@mui/material';
import { Google, GitHub } from '@mui/icons-material';
import { useLocation } from 'react-router-dom';

/**
 * Configuration object for authentication providers.
 *
 * @constant
 * @type {Object<string, {icon: JSX.Element, bg: string, textColor: string}>}
 */
const baseConfig = {
  google: {
    icon: <Google />,
    bg: '#fff',
    textColor: '#212121',
  },
  github: {
    icon: <GitHub />,
    bg: '#333',
    textColor: '#fff',
  },
};

/**
 * AuthProviderButton Component
 *
 * @function AuthProviderButton
 * @param {Object} props - Component props.
 * @param {'google'|'github'} props.provider - The authentication provider to use.
 * @param {Function} props.onClick - Callback function triggered when the button is clicked.
 * @returns {JSX.Element} A styled button component for initiating OAuth authentication.
 *
 * @example
 * <AuthProviderButton
 *   provider="google"
 *   onClick={() => console.log("Google login initiated")}
 * />
 *
 * <AuthProviderButton
 *   provider="github"
 *   onClick={() => console.log("GitHub login initiated")}
 * />
 */
const AuthProviderButton = ({ provider, onClick }) => {
  const location = useLocation();
  const isSignIn = location.pathname === '/sign-in';
  const isSignUp = location.pathname === '/register';

  const config = baseConfig[provider];

  const label = isSignIn
    ? `Sign in with ${provider.charAt(0).toUpperCase() + provider.slice(1)}`
    : isSignUp
    ? `Sign up with ${provider.charAt(0).toUpperCase() + provider.slice(1)}`
    : `Continue with ${provider.charAt(0).toUpperCase() + provider.slice(1)}`;

  return (
    <Button
      variant="outlined"
      fullWidth
      startIcon={config.icon}
      onClick={onClick}
      aria-label={label}
      sx={{
        mb: 2,
        bgcolor: config.bg,
        color: config.textColor,
        borderColor: 'divider',
        ':hover': {
          opacity: 0.9,
        },
      }}
    >
      {label}
    </Button>
  );
};

export default AuthProviderButton;
