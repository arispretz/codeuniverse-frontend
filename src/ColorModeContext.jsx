import { createContext } from "react";

/**
 * @fileoverview Color mode context.
 * Provides a React Context for managing application color mode (light/dark theme).
 * Includes a toggle function to switch between modes.
 *
 * @module ColorModeContext
 */

/**
 * Type definition for the ColorModeContext.
 *
 * @typedef {Object} ColorModeContextType
 * @property {Function} toggleColorMode - Function to toggle between light and dark mode.
 */

/**
 * React Context for color mode management.
 * Default implementation provides a no-op `toggleColorMode` function.
 *
 * @type {React.Context<ColorModeContextType>}
 *
 * @example
 * // Usage in a provider
 * import { ColorModeContext } from "./ColorModeContext";
 *
 * function App() {
 *   const toggleColorMode = () => {
 *     // implement theme switching logic
 *   };
 *
 *   return (
 *     <ColorModeContext.Provider value={{ toggleColorMode }}>
 *       <MyApp />
 *     </ColorModeContext.Provider>
 *   );
 * }
 *
 * // Usage in a consumer
 * import { useContext } from "react";
 * import { ColorModeContext } from "./ColorModeContext";
 *
 * function ThemeToggleButton() {
 *   const { toggleColorMode } = useContext(ColorModeContext);
 *   return <button onClick={toggleColorMode}>Toggle Theme</button>;
 * }
 */
export const ColorModeContext = createContext({
  toggleColorMode: () => {},
});
