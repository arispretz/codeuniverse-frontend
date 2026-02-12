import React, { useMemo, useState } from "react";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { darkTheme, lightTheme } from "./theme.js";
import { ColorModeContext } from "./ColorModeContext.jsx";

/**
 * @fileoverview ThemeWrapper component 🌗
 * Provides dynamic theming (light/dark) across the application.
 * - Reads the user's preference from localStorage.
 * - Exposes a toggle function via `ColorModeContext`.
 * - Wraps the app with MUI's `ThemeProvider` and `CssBaseline`.
 *
 * @module ThemeWrapper
 */

/**
 * ThemeWrapper component 🌗
 *
 * @component
 * @param {Object} props - Component props.
 * @param {React.ReactNode} props.children - Child components wrapped by the theme provider.
 * @returns {JSX.Element} Themed application wrapper.
 *
 * @example
 * import ThemeWrapper from "./ThemeWrapper";
 *
 * function AppRoot() {
 *   return (
 *     <ThemeWrapper>
 *       <App />
 *     </ThemeWrapper>
 *   );
 * }
 */
const ThemeWrapper = ({ children }) => {
  // 🔹 Initialize theme mode from localStorage, default to "dark"
  const [mode, setMode] = useState(() => {
    try {
      return localStorage.getItem("colorMode") || "dark";
    } catch {
      return "dark";
    }
  });

  // 🔹 Memoized toggle function to switch between light and dark
  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prev) => {
          const next = prev === "light" ? "dark" : "light";
          try {
            localStorage.setItem("colorMode", next);
          } catch {
            // silently ignore storage errors
          }
          return next;
        });
      },
    }),
    []
  );

  // 🔹 Select theme based on current mode
  const theme = mode === "light" ? lightTheme : darkTheme;

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
};

export default ThemeWrapper;
