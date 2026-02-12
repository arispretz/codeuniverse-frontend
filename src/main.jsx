import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import ThemeWrapper from "./ThemeWrapper.jsx";
import { AuthProvider } from "./context/AuthProvider.jsx";
import { ModalProvider } from "./context/ModalProvider.jsx";
import ErrorBoundaryWrapper from "./components/ErrorBoundaryWrapper.jsx";
import { SnackbarProvider } from "notistack";
import "./utils/axiosConfig.js";
import { App } from "./App.jsx";
import "./index.css";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

/**
 * @fileoverview Application entry point.
 * 
 * This file mounts the React application into the DOM and wraps it with multiple providers:
 * - **StrictMode**: Enforces React best practices and highlights potential issues.
 * - **BrowserRouter**: Enables client-side routing.
 * - **ErrorBoundaryWrapper**: Catches and displays runtime errors gracefully.
 * - **AuthProvider**: Provides authentication context (Firebase + backend).
 * - **ThemeWrapper**: Manages light/dark theme context.
 * - **SnackbarProvider**: Handles global notifications (max 3 concurrent snackbars).
 * - **LocalizationProvider**: Provides date/time localization using `date-fns`.
 * - **ModalProvider**: Manages global modals across the app.
 *
 * @module main
 * @example
 * // This file is automatically executed when the app starts.
 * // It mounts <App /> into the #root element in index.html.
 */
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <ErrorBoundaryWrapper>
        <AuthProvider>
          <ThemeWrapper>
            <SnackbarProvider maxSnack={3}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <ModalProvider>
                  <App />
                </ModalProvider>
              </LocalizationProvider>
            </SnackbarProvider>
          </ThemeWrapper>
        </AuthProvider>
      </ErrorBoundaryWrapper>
    </BrowserRouter>
  </StrictMode>
);
