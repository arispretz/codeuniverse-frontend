import axios from "axios";
import { getUserToken } from "../utils/userToken.js";

const FASTAPI_URL = import.meta.env.VITE_FASTAPI_URL;
const EXPRESS_URL = import.meta.env.VITE_EXPRESS_URL;
const RAPIDAPI_KEY = import.meta.env.VITE_RAPIDAPI_KEY;

if (!FASTAPI_URL) {
  throw new Error("Missing environment variable: VITE_FASTAPI_URL");
}
if (!EXPRESS_URL) {
  throw new Error("Missing environment variable: VITE_EXPRESS_URL");
}
if (!RAPIDAPI_KEY) {
  throw new Error("Missing environment variable: VITE_RAPIDAPI_KEY");
}

/**
 * @fileoverview Code services client.
 * Provides functions to interact with different backends for code-related tasks:
 * - Linting code (Express backend)
 * - Running code (Judge0 via RapidAPI)
 * - Autocompleting code (FastAPI backend)
 *
 * All requests require authentication (Firebase ID token or RapidAPI key).
 *
 * @module services/editorServices
 */

/**
 * Lint code using Express backend.
 *
 * @async
 * @function lintCodeService
 * @param {string} code - Source code to lint.
 * @param {string} language - Programming language of the code.
 * @returns {Promise<Object>} Linting results object returned by the backend.
 *
 * @throws {Error} If user is not authenticated or request fails.
 *
 * @example
 * const lintResults = await lintCodeService("const x=1;", "javascript");
 * console.log(lintResults.errors);
 */
export async function lintCodeService(code, language) {
  const token = await getUserToken(true);
  if (!token) throw new Error("User not authenticated");

  const { data } = await axios.post(
    `${EXPRESS_URL}/api/lint`,
    { code, language },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return data;
}

/**
 * Execute code using Judge0 (RapidAPI).
 *
 * @async
 * @function runCodeService
 * @param {string} code - Source code to execute.
 * @param {number} languageId - Judge0 language ID (e.g., 52 for Python, 62 for Java).
 * @returns {Promise<Object>} Execution results including stdout, stderr, and status.
 *
 * @throws {Error} If RapidAPI key is missing or request fails.
 *
 * @example
 * const result = await runCodeService("print('Hello')", 52);
 * console.log(result.stdout); // "Hello"
 */
export async function runCodeService(code, languageId) {
  const { data } = await axios.post(
    "https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=false&wait=true",
    {
      source_code: code,
      language_id: languageId,
    },
    {
      headers: {
        "Content-Type": "application/json",
        "X-RapidAPI-Key": RAPIDAPI_KEY,
        "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
      },
    }
  );
  return data;
}

/**
 * Autocomplete code using FastAPI backend.
 *
 * @async
 * @function autocompleteService
 * @param {string} code - Source code to autocomplete.
 * @param {string} language - Programming language of the code.
 * @returns {Promise<Object>} Autocompletion results object returned by the backend.
 *
 * @throws {Error} If user is not authenticated or request fails.
 *
 * @example
 * const suggestion = await autocompleteService("function add(a, b) {", "javascript");
 * console.log(suggestion.completion);
 */
export async function autocompleteService(code, language) {
  const token = await getUserToken(true);
  if (!token) throw new Error("User not authenticated");

  const { data } = await axios.post(
    `${FASTAPI_URL}/autocomplete`,
    { code, language },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return data;
}
