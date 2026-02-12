import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import { defineConfig } from "eslint";

/**
 * @fileoverview ESLint configuration for CodeUniverse frontend.
 * Provides linting rules for:
 * - Modern JavaScript (via @eslint/js recommended config)
 * - React projects (via eslint-plugin-react-hooks)
 * - Vite-specific refresh handling (via eslint-plugin-react-refresh)
 *
 * @module eslint.config
 */

export default defineConfig({
  // Ignore build output directory
  ignorePatterns: ["dist"],

  overrides: [
    {
      // Apply rules to JS and JSX files
      files: ["**/*.{js,jsx}"],

      // Extend recommended configs
      extends: [
        js.configs.recommended, // Base recommended rules for JS
        reactHooks.configs["recommended-latest"], // Best practices for React Hooks
        reactRefresh.configs.vite, // Vite-specific hot refresh handling
      ],

      // Language and parser options
      languageOptions: {
        ecmaVersion: "latest", // Enable latest ECMAScript features
        sourceType: "module", // Use ES modules
        globals: {
          ...globals.browser, // Browser globals (window, document, etc.)
          ...globals.jest,    // Jest globals (describe, it, expect)
        },
        parserOptions: {
          ecmaFeatures: { jsx: true }, // Enable JSX parsing
        },
      },

      // Custom rules
      rules: {
        // Disallow unused variables, but ignore constants in ALL_CAPS
        "no-unused-vars": ["error", { varsIgnorePattern: "^[A-Z_]" }],
      },
    },
  ],
});
