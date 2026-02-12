import React, { useContext } from "react";
import { IconButton, Tooltip } from "@mui/material";
import { Brightness4, Brightness7 } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import { ColorModeContext } from "./ColorModeContext.jsx";

/**
 * @fileoverview ThemeToggleButton component.
 * Provides a button that allows users to switch between light and dark themes.
 * - Uses MUI's `useTheme` hook to detect the current palette mode.
 * - Uses a custom `ColorModeContext` to toggle between modes.
 *
 * @component ThemeToggleButton
 * @returns {JSX.Element} A button with an icon that toggles the theme.
 *
 * @example
 * import ThemeToggleButton from "./ThemeToggleButton";
 *
 * function Navbar() {
 *   return (
 *     <nav>
 *       <ThemeToggleButton />
 *     </nav>
 *   );
 * }
 */
const ThemeToggleButton = () => {
  const theme = useTheme();
  const colorMode = useContext(ColorModeContext);

  // Detect current mode
  const isDarkMode = theme.palette.mode === "dark";

  return (
    <Tooltip title="Toggle theme">
      <IconButton
        onClick={colorMode.toggleColorMode}
        aria-label="Toggle theme"
      >
        {isDarkMode ? <Brightness7 /> : <Brightness4 />}
      </IconButton>
    </Tooltip>
  );
};

export default ThemeToggleButton;
