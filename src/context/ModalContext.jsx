import React, { createContext } from 'react';

/**
 * @fileoverview ModalContext
 * Provides global state management for modal visibility across the application.
 * Exposes functions to open and close modals by identifier.
 *
 * @module context/ModalContext
 */

/**
 * @typedef {Object} ModalContextValue
 * @property {string|null} openModal - Identifier of the currently open modal, or `null` if none.
 * @property {Function} open - Function to open a modal by name.
 * @property {Function} close - Function to close the currently open modal.
 *
 * @example
 * // Usage with useContext
 * import { useContext } from 'react';
 * import { ModalContext } from './ModalContext';
 *
 * const MyComponent = () => {
 *   const { openModal, open, close } = useContext(ModalContext);
 *
 *   return (
 *     <div>
 *       <button onClick={() => open('settings')}>Open Settings Modal</button>
 *       {openModal === 'settings' && (
 *         <SettingsModal onClose={close} />
 *       )}
 *     </div>
 *   );
 * };
 */

/** @type {React.Context<ModalContextValue>} */
export const ModalContext = createContext({
  openModal: null,
  open: () => {},
  close: () => {},
});
