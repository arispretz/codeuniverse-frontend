/**
 * @fileoverview RedirectHandler component.
 * Handles the result of a Firebase OAuth redirect (e.g., Google, GitHub).
 * Synchronizes the authenticated user with the backend and navigates
 * based on their role. If no user is found or an error occurs,
 * redirects to the sign-in page.
 *
 * Typically used at the `/redirect` route after a user logs in
 * via `signInWithRedirect`.
 *
 * @module components/RedirectHandler
 */

import React, { useEffect, useRef } from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { getRedirectResult } from 'firebase/auth';
import { auth } from '../firebase/auth';
import { syncUserAndRedirect } from '../utils/syncUserAndRedirect';

/**
 * RedirectHandler Component
 *
 * @function RedirectHandler
 * @returns {JSX.Element} A loading spinner while authentication is being processed.
 *
 * @example
 * // Usage in routing
 * <Route path="/redirect" element={<RedirectHandler />} />
 */
const RedirectHandler = () => {
  const navigate = useNavigate();
  const hasHandled = useRef(false); 

  useEffect(() => {
    /**
     * Processes the Firebase redirect result.
     * If a user is found, synchronizes with backend and navigates.
     * Otherwise, redirects to sign-in page.
     *
     * @async
     * @function handleRedirect
     * @returns {Promise<void>}
     */
    const handleRedirect = async () => {
      if (hasHandled.current) return;
      hasHandled.current = true;

      try {
        const result = await getRedirectResult(auth);
        
        if (result?.user) {
          await syncUserAndRedirect(result.user, navigate);
        } else {
          console.warn('⚠️ No user found in redirect result');
          navigate('/sign-in');
        }
      } catch (err) {
        console.error('❌ Redirect error:', err.message);
        navigate('/sign-in');
      }
    };

    handleRedirect();
  }, [navigate]);

  return (
    <Box 
      sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}
      role="status"
      aria-label="Processing login"
    >
      <CircularProgress aria-label="Loading spinner" />
      <Typography sx={{ ml: 2 }}>Processing login…</Typography>
    </Box>
  );
};

export default RedirectHandler;
