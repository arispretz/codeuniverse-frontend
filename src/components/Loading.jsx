/**
 * @fileoverview Loading component.
 * Provides a reusable loading spinner using MUI's CircularProgress.
 * Displays a centered circular progress indicator, typically used while
 * fetching data or performing asynchronous operations.
 *
 * @module components/Loading
 */

import React from 'react';
import { CircularProgress, Box } from '@mui/material';

/**
 * Loading Component
 *
 * @function Loading
 * @returns {JSX.Element} A centered circular progress indicator.
 *
 * @example
 * // Usage in a page while data is loading
 * {isLoading ? <Loading /> : <Content />}
 */
const Loading = () => {
  return (
    <Box
      sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}
      role="status"
      aria-label="Loading content"
    >
      <CircularProgress aria-label="Loading spinner" />
    </Box>
  );
};

export default Loading;
