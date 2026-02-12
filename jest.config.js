/**
 * @fileoverview Jest configuration for CodeUniverse frontend.
 * Provides testing setup for React components using Babel and jsdom.
 * - Simulates a browser-like environment with `jsdom`.
 * - Uses Babel for transforming modern JS/JSX.
 * - Supports coverage reporting and custom setup files.
 *
 * @module jest.config
 */

export default {
  // 🔹 Simulates a browser-like environment for React components
  testEnvironment: "jsdom",

  // 🔹 Setup file to configure testing utilities (e.g., custom matchers like @testing-library/jest-dom)
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],

  // 🔹 Match test files inside __tests__ folders or files ending in .test.js / .spec.js
  testMatch: [
    "**/__tests__/**/*.js?(x)",
    "**/?(*.)+(spec|test).[jt]s?(x)",
  ],

  // 🔹 Use Babel to transform JS, JSX, TS, TSX, and MJS files
  transform: {
    "^.+\\.[jt]sx?$": "babel-jest",
    "^.+\\.mjs$": "babel-jest",
  },

  // 🔹 Recognized file extensions for modules
  moduleFileExtensions: ["js", "jsx", "ts", "tsx", "json", "node", "mjs"],

  // 🔹 Enable coverage reporting
  collectCoverage: true,
  coverageDirectory: "coverage",

  // 🔹 Ignore coverage from config and setup files
  coveragePathIgnorePatterns: [
    "/node_modules/",
    "jest.config.js",
    "jest.setup.js",
  ],

  // 🔹 TransformIgnorePatterns: allow Jest to transpile ESM packages if needed
  transformIgnorePatterns: [
    "/node_modules/(?!(@testing-library|socket.io-client|node-fetch)/)",
  ],

  // 🔹 Show more detailed test results
  verbose: true,
};
