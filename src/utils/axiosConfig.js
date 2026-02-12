import axios from "axios";
import { getAuth } from "firebase/auth";
import { app } from "../hooks/init.js";

axios.defaults.withCredentials = false;

const auth = getAuth(app);

/**
 * @fileoverview Axios interceptor for Firebase authentication.
 * Configures Axios to automatically attach a Firebase ID token
 * or a fallback token from localStorage to every outgoing request.
 *
 * - Uses `auth.currentUser.getIdToken()` to retrieve the token if a user is logged in.
 * - Falls back to `localStorage.getItem("token")` if no Firebase user is available.
 * - Ensures all requests include `Authorization: Bearer <token>` header when possible.
 *
 * @module utils/axiosConfig
 */

/**
 * Axios interceptor to automatically attach Firebase ID token
 * or fallback token from localStorage to every request.
 *
 * @async
 * @function
 * @param {AxiosRequestConfig} config - Axios request configuration.
 * @returns {Promise<AxiosRequestConfig>} Modified request config with Authorization header.
 *
 * @example
 * // After importing this file, all Axios requests will include the token automatically:
 * const response = await axios.get("/api/protected-route");
 * console.log(response.data);
 */
axios.interceptors.request.use(async (config) => {
  const user = auth.currentUser;

  if (user) {
    try {
      // ✅ Retrieve Firebase ID token without forcing refresh
      const token = await user.getIdToken();
      config.headers.Authorization = `Bearer ${token}`;
    } catch (error) {
      console.warn("⚠️ Failed to retrieve token for Axios request:", error.message);
    }
  } else {
    // 🔄 Fallback: use token stored in localStorage
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  return config;
});
