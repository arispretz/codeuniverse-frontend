import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import monacoEditorPlugin from "vite-plugin-monaco-editor";

/**
 * @fileoverview Vite configuration for CodeUniverse frontend.
 * Provides:
 * - React plugin integration
 * - Monaco editor support
 * - Dev server settings (host, port, HMR, proxy)
 * - Dependency optimization
 * - Build options
 *
 * @module vite.config
 */

export default defineConfig(({ mode }) => {
  return {
    // 🔹 Plugins
    plugins: [
      react(), // Enable React fast refresh and JSX support
      monacoEditorPlugin.default({}), // Integrate Monaco editor
    ],

    // 🔹 Development server configuration
    server: {
      host: "0.0.0.0", // Allow external access
      port: 5173, // Default dev server port
      allowedHosts: ["localhost", "app.local"], // Restrict allowed hosts
      hmr: {
        protocol: "ws", // Hot Module Replacement over WebSocket
        host: "localhost", // Replace with machine IP if accessed externally
        clientPort: 5173,
      },
      proxy:
        mode === "development"
          ? {
              // API proxy for backend requests
              "/api": {
                target: process.env.VITE_EXPRESS_URL,
                changeOrigin: true,
                secure: false,
              },
              // WebSocket proxy for Socket.IO
              "/socket.io": {
                target: process.env.VITE_SOCKET_URL,
                ws: true,
                changeOrigin: true,
              },
            }
          : undefined,
    },

    // 🔹 Dependency optimization
    optimizeDeps: {
      exclude: ["monaco-editor", "eslint4b"], // Exclude heavy/unsupported deps
    },

    // 🔹 Build configuration
    build: {
      sourcemap: false, // Disable source maps for production
      rollupOptions: {
        external: ["monaco-editor/esm/vs/editor/editor.api.js"], // Avoid bundling Monaco API
      },
    },
  };
});

