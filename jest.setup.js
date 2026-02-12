/**
 * @fileoverview Jest setup file for CodeUniverse frontend tests.
 *
 * Extends Jest with:
 * - Custom matchers from `@testing-library/jest-dom`
 * - dotenv for `.env.test`
 * - Polyfill of `fetch` for Firebase and modern libraries
 * - Polyfill of TextEncoder/TextDecoder for React Router/Firebase
 * - Mock of `import.meta.env` for Vite environment variables
 *
 * @module jest.setup
 */

import "@testing-library/jest-dom";
import dotenv from "dotenv";
import "whatwg-fetch";
import { TextEncoder, TextDecoder } from "util";

// Load environment variables from .env.test
dotenv.config({ path: ".env.test" });

// Polyfill TextEncoder/TextDecoder (used by react-router and Firebase)
if (!globalThis.TextEncoder) {
  globalThis.TextEncoder = TextEncoder;
}
if (!globalThis.TextDecoder) {
  globalThis.TextDecoder = TextDecoder;
}

// Mock import.meta.env for Vite in test environment
globalThis.import = {
  meta: {
    env: {
      VITE_ENV: "test",
      VITE_FIREBASE_API_KEY: "firebase_test_key",
      VITE_FIREBASE_AUTH_DOMAIN: "test-app.firebaseapp.com",
      VITE_FIREBASE_PROJECT_ID: "test-project",
      VITE_FIREBASE_APP_ID: "1:1234567890:web:abcdef123456",
      VITE_EXPRESS_URL: "http://localhost:4000",
      VITE_BACKEND_WS_HOST: "ws://localhost:4000",
      VITE_SOCKET_SERVER_URL: "http://localhost:5001",
      VITE_SOCKET_URL: "ws://localhost:5001",
      VITE_RAPIDAPI_KEY: "rapidapi_test_key",
      VITE_FASTAPI_URL: "http://localhost:6000",
      VITE_ASSISTANT_USER_ID: "test-assistant-id",
      VITE_DASHBOARD_ALLOWED_ROLES: "ADMIN,MANAGER,USER",
      SOCKET_CORS_ORIGINS: "http://localhost:3000",
    },
  },
};
