/**
 * @fileoverview SuspenseWrapper component.
 * Provides a reusable wrapper around React's `Suspense` to handle lazy-loaded components.
 * Displays a fallback loader (`Loading` component) while child components are being loaded.
 *
 * @module components/SuspenseWrapper
 */

import React, { Suspense } from 'react';
import PropTypes from 'prop-types';
import Loading from './Loading.jsx';

/**
 * SuspenseWrapper Component
 *
 * @function SuspenseWrapper
 * @param {Object} props - Component props.
 * @param {React.ReactNode} props.children - Components to render once suspense resolves.
 * @returns {JSX.Element} Suspense boundary with loading fallback.
 *
 * @example
 * // Usage with React.lazy
 * const LazyComponent = React.lazy(() => import('./LazyComponent'));
 *
 * <SuspenseWrapper>
 *   <LazyComponent />
 * </SuspenseWrapper>
 */
const SuspenseWrapper = ({ children }) => {
  return (
    <Suspense fallback={<Loading />}>
      {children}
    </Suspense>
  );
};

SuspenseWrapper.propTypes = {
  /** Components to render once suspense resolves */
  children: PropTypes.node.isRequired,
};

export default SuspenseWrapper;
