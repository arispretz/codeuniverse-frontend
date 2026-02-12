/**
 * @fileoverview ModalProvider component.
 * Wraps the application with modal context, providing global state management
 * for opening and closing modals by name.
 *
 * @module context/ModalProvider
 */

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { ModalContext } from './ModalContext';

/**
 * ModalProvider Component
 *
 * @function ModalProvider
 * @param {Object} props - Component props.
 * @param {React.ReactNode} props.children - Child components that consume modal context.
 * @returns {JSX.Element} ModalContext provider wrapping children.
 *
 * @example
 * // Usage in App.jsx
 * import { ModalProvider } from './context/ModalProvider';
 *
 * function App() {
 *   return (
 *     <ModalProvider>
 *       <MyLayout />
 *     </ModalProvider>
 *   );
 * }
 */
export const ModalProvider = ({ children }) => {
  const [openModal, setOpenModal] = useState(null);

  /**
   * Opens a modal by name.
   *
   * @function open
   * @param {string} modalName - Identifier of the modal to open.
   */
  const open = (modalName) => setOpenModal(modalName);

  /**
   * Closes the currently open modal.
   *
   * @function close
   */
  const close = () => setOpenModal(null);

  return (
    <ModalContext.Provider value={{ openModal, open, close }}>
      {children}
    </ModalContext.Provider>
  );
};

ModalProvider.propTypes = {
  /** Child components that consume modal context */
  children: PropTypes.node.isRequired,
};
