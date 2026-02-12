/**
 * @fileoverview ErrorBoundaryWrapper component.
 * Provides an error boundary that catches rendering errors in child components.
 * Displays a fallback UI with a reload option when an error occurs.
 *
 * @module components/ErrorBoundaryWrapper
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Typography, Box, Button } from '@mui/material';

/**
 * ErrorBoundaryWrapper Component
 *
 * @class ErrorBoundaryWrapper
 * @extends React.Component
 *
 * @param {Object} props - Component props.
 * @param {React.ReactNode} props.children - Child components to wrap with error boundary.
 *
 * @property {boolean} state.hasError - Indicates whether an error has been caught.
 *
 * @returns {JSX.Element} Fallback UI when an error occurs, or the wrapped children otherwise.
 *
 * @example
 * <ErrorBoundaryWrapper>
 *   <MyComponent />
 * </ErrorBoundaryWrapper>
 */
class ErrorBoundaryWrapper extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  /**
   * Lifecycle method invoked when an error is thrown in a child component.
   * Updates state to display fallback UI.
   *
   * @static
   * @function getDerivedStateFromError
   * @param {Error} error - The error thrown by a child component.
   * @returns {Object} Updated state with `hasError: true`.
   */
  static getDerivedStateFromError(error) {
    try {
      const safeError = {
        message: String(error?.message || 'Unknown error'),
        stack: String(error?.stack || 'No stack trace'),
        name: String(error?.name || 'Error'),
      };
      console.error('React caught an error:', safeError);
    } catch (e) {
      console.error('React caught an unserializable error:', String(error));
    }

    return { hasError: true };
  }

  /**
   * Lifecycle method invoked after an error has been caught.
   * Logs error details and component stack trace.
   *
   * @function componentDidCatch
   * @param {Error} error - The error object.
   * @param {Object} info - Additional info including component stack trace.
   */
  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught an error:', error);
    console.error('Component stack:', info.componentStack);
  }

  /**
   * Handles retry by resetting error state and reloading the page.
   *
   * @function handleRetry
   * @returns {void}
   */
  handleRetry = () => {
    this.setState({ hasError: false });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <Box
          role="alert"
          sx={{
            p: 4,
            textAlign: 'center',
            backgroundColor: '#fff3f3',
            borderRadius: 2,
            boxShadow: 2,
          }}
        >
          <Typography variant="h5" color="error" gutterBottom>
            Something went wrong 😔
          </Typography>
          <Typography variant="body1" color="text.secondary" gutterBottom>
            Please try reloading the page or come back later.
          </Typography>
          <Button
            variant="contained"
            onClick={this.handleRetry}
            aria-label="Reload page"
          >
            🔄 Reload
          </Button>
        </Box>
      );
    }

    return this.props.children;
  }
}

ErrorBoundaryWrapper.propTypes = {
  /** Child components to wrap with error boundary */
  children: PropTypes.node.isRequired,
};

export default ErrorBoundaryWrapper;
