import React from "react";
import { useRoutes } from "react-router-dom";
import { routes } from "./routes/Routes.jsx";
import SuspenseWrapper from "./components/SuspenseWrapper.jsx";

/**
 * @fileoverview Main application component.
 * Responsible for:
 * - Initializing React Router routes via `useRoutes`.
 * - Wrapping routes with a `SuspenseWrapper` to handle lazy loading boundaries.
 *
 * @component App
 * @returns {JSX.Element} The rendered application with routing and suspense handling.
 *
 * @example
 * import { App } from "./App";
 * import { createRoot } from "react-dom/client";
 *
 * const root = createRoot(document.getElementById("root"));
 * root.render(<App />);
 */
export function App() {
  // Generate route elements from the route configuration
  const element = useRoutes(routes);

  return (
    // Wrap routes with Suspense boundary for lazy-loaded components
    <SuspenseWrapper>
      {element}
    </SuspenseWrapper>
  );
}
