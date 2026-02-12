/**
 * @fileoverview Babel configuration for CodeUniverse frontend.
 * Provides support for:
 * - Modern JavaScript features via `@babel/preset-env`
 * - React JSX transpilation via `@babel/preset-react`
 * - Transform Vite's `import.meta.env` into `process.env` for Jest compatibility
 *
 * @module babel.config
 */

export default {
  presets: [
    [
      "@babel/preset-env",
      {
        // Transpile based on default browser targets (as defined by Browserslist)
        targets: "defaults",
      },
    ],
    [
      // Enable JSX and React transformations with automatic runtime
      "@babel/preset-react",
      {
        runtime: "automatic",
      },
    ],
  ],
  plugins: [
    // 🔹 Transforms import.meta.env.* into process.env.* for Jest compatibility
    "babel-plugin-transform-vite-meta-env",
  ],
};
