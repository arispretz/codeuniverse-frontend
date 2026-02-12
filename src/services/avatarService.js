import axios from "axios";
import { getUserToken } from "../utils/userToken.js";

const BASE_URL = import.meta.env.VITE_EXPRESS_URL;
if (!BASE_URL) {
  throw new Error("Missing environment variable: VITE_EXPRESS_URL");
}

/**
 * @fileoverview getAvatars utility.
 * Fetches user avatars from the backend Express API.
 * - Requires a valid Firebase ID token for authentication.
 * - The backend should return an array of objects with shape: `{ name: string, avatarUrl: string }`.
 * - Converts the array into a dictionary mapping user names to avatar URLs.
 *
 * @module services/avatarService
 */

/**
 * Fetches user avatars from the backend.
 *
 * @async
 * @function getAvatars
 * @returns {Promise<Object<string, string>>} A dictionary mapping user names to avatar URLs.
 *
 * @throws {Error} If the user is not authenticated or the request fails.
 *
 * @example
 * import { getAvatars } from './api/getAvatars';
 *
 * const avatars = await getAvatars();
 * console.log(avatars);
 * // {
 * //   "Alice": "https://cdn.example.com/avatars/alice.png",
 * //   "Bob": "https://cdn.example.com/avatars/bob.png"
 * // }
 */
export const getAvatars = async () => {
  try {
    const token = await getUserToken(true);
    if (!token) throw new Error("User not authenticated");

    const res = await axios.get(`${BASE_URL}/api/avatars`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = res.data || [];

    // 🔄 Transform array into dictionary { name: avatarUrl }
    const avatarMap = {};
    data.forEach((user) => {
      avatarMap[user.name] = user.avatarUrl;
    });

    return avatarMap;
  } catch (err) {
    console.error("❌ Error fetching avatars:", err);
    return {};
  }
};
