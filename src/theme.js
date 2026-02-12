import { createTheme } from "@mui/material/styles";

/**
 * @fileoverview Custom MUI theme configurations.
 * Provides both dark and light theme variants with:
 * - Custom palette (colors for primary, secondary, background, text, action, divider, navbar)
 * - Typography settings
 * - Shape (border radius)
 * - Component style overrides (MuiLink, MuiIconButton, MuiMenuItem, etc.)
 *
 * @module theme
 */

/**
 * Dark theme configuration for MUI.
 * Includes custom palette, typography, shape, and component overrides.
 *
 * @constant
 * @type {Theme}
 *
 * @example
 * import { ThemeProvider } from "@mui/material/styles";
 * import { darkTheme } from "./theme";
 *
 * function App() {
 *   return (
 *     <ThemeProvider theme={darkTheme}>
 *       <MyApp />
 *     </ThemeProvider>
 *   );
 * }
 */
export const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#64b5f6",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#06305f5b",
      contrastText: "#212121",
    },
    background: {
      default: "#0a2540",
      paper: "#142f4f",
    },
    text: {
      primary: "#e0e0e0",
      secondary: "#90a6b1ff",
      disabled: "#757575",
    },
    action: {
      hover: "#1a3b5d",
      selected: "#22476a",
      disabled: "#37474f",
    },
    divider: "#3c536e",
    navbar: {
      background: "#f2f4e8",
      text: "#260c51ff",
    },
  },
  typography: {
    fontFamily: "Roboto, sans-serif",
    button: {
      textTransform: "none",
      fontWeight: 800,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiLink: {
      styleOverrides: {
        root: {
          color: "#0e24ed93",
          "&:hover": {
            color: "#0e054cff",
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          color: "#FFD700",
          "&:hover": {
            color: "#FFF275",
          },
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          "&:hover": {
            backgroundColor: "#22476a",
            color: "#ffffff",
          },
          "&.Mui-selected": {
            backgroundColor: "#1a3b5d",
            color: "#ffffff",
          },
          "&.Mui-selected:hover": {
            backgroundColor: "#2c5e8a",
            color: "#ffffff",
          },
        },
      },
    },
  },
});

/**
 * Light theme configuration for MUI.
 * Includes custom palette, typography, shape, and component overrides.
 *
 * @constant
 * @type {Theme}
 *
 * @example
 * import { ThemeProvider } from "@mui/material/styles";
 * import { lightTheme } from "./theme";
 *
 * function App() {
 *   return (
 *     <ThemeProvider theme={lightTheme}>
 *       <MyApp />
 *     </ThemeProvider>
 *   );
 * }
 */
export const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#1976d2",
      contrastText: "#ebeeddff",
    },
    secondary: {
      main: "#c4a51d7c",
      contrastText: "#d8dfceff",
    },
    background: {
      default: "#FEFDEA",
      paper: "#e0e0e0",
    },
    text: {
      primary: "#260c51ff",
      secondary: "#8e5ea0ff",
      disabled: "#8424c9ff",
    },
    action: {
      hover: "#d2d2c0ff",
      selected: "#cbc586ff",
      disabled: "#cccccc",
    },
    divider: "#bdbdbd",
    navbar: {
      background: "#142f4f",
      text: "#e0e0e0",
    },
  },
  typography: {
    fontFamily: "Roboto, sans-serif",
    button: {
      textTransform: "none",
      fontWeight: 800,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiLink: {
      styleOverrides: {
        root: {
          color: "#1206f8ff",
          "&:hover": {
            color: "#0d17a1a8",
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          color: "#F5F5F5",
          "&:hover": {
            color: "#939197ff",
          },
        },
      },
    },
  },
});
