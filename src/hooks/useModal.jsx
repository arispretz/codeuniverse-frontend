import { useContext } from 'react';
import { ModalContext } from '../context/ModalContext.jsx';

/**
 * @fileoverview useModal hook.
 * Provides a convenient way to access the modal context throughout the application.
 * Returns the current modal state and control functions (`open`, `close`).
 *
 * @module hooks/useModal
 */

/**
 * Custom hook to access modal context.
 *
 * @function useModal
 * @returns {ModalContextValue} The current modal context value.
 *
 * @example
 * import { useModal } from '../hooks/useModal';
 *
 * const SettingsButton = () => {
 *   const { openModal, open, close } = useModal();
 *
 *   return (
 *     <>
 *       <button onClick={() => open('settings')}>Open Settings</button>
 *       {openModal === 'settings' && (
 *         <SettingsModal onClose={close} />
 *       )}
 *     </>
 *   );
 * };
 */
export const useModal = () => useContext(ModalContext);
