import axios from "axios";
import { getUserToken } from "../utils/userToken.js";

const BASE_URL = import.meta.env.VITE_EXPRESS_URL;
if (!BASE_URL) {
  throw new Error("Missing environment variable: VITE_EXPRESS_URL");
}

/**
 * @fileoverview User API client.
 * Provides functions to interact with the Express backend for user management:
 * - Fetch authenticated user profile and role
 * - Fetch all users (admin only)
 * - Fetch, update, and delete users by ID
 * - Fetch public users (no authentication required)
 *
 * All authenticated requests require a valid Firebase ID token.
 *
 * @module services/userService
 */

/**
 * Fetch the authenticated user (profile + role + team).
 */
export async function getCurrentUser() {
  const token = await getUserToken(true);
  if (!token) throw new Error("User not authenticated");

  const { data } = await axios.get(`${BASE_URL}/api/users/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
}

/**
 * Fetch all users (admin only).
 */
export async function getAllUsers() {
  const token = await getUserToken(true);
  if (!token) throw new Error("User not authenticated");

  const { data } = await axios.get(`${BASE_URL}/api/users/admin`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
}

/**
 * Fetch a user by ID.
 */
export async function getUserById(id) {
  const token = await getUserToken(true);
  if (!token) throw new Error("User not authenticated");

  const { data } = await axios.get(`${BASE_URL}/api/users/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
}

/**
 * Update a user's role.
 *
 * @async
 * @function updateUserRole
 * @param {string} id - Firebase UID of the user.
 * @param {string} role - New role to assign.
 * @returns {Promise<Object>} Updated user data.
 */
export async function updateUserRole(id, role) {
  const token = await getUserToken(true);
  if (!token) throw new Error("User not authenticated");

  const { data } = await axios.patch(
    `${BASE_URL}/api/users/${id}/role`,
    { role },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return data;
}

/**
 * Update a user's team.
 *
 * @async
 * @function updateUserTeam
 * @param {string} id - Firebase UID of the user.
 * @param {string} team - New team to assign.
 * @returns {Promise<Object>} Updated user data.
 */
export async function updateUserTeam(firebaseUid, team) {
  const token = await getUserToken(true);
  if (!token) throw new Error("User not authenticated");

  const { data } = await axios.patch(
    `${BASE_URL}/api/users/${firebaseUid}/team`,
    { team },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return data;
}

/**
 * Delete a user by ID.
 */
export async function deleteUser(id) {
  const token = await getUserToken(true);
  if (!token) throw new Error("User not authenticated");

  const { data } = await axios.delete(`${BASE_URL}/api/users/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
}

/**
 * Fetch public users (no authentication required).
 */
export async function getPublicUsers() {
  const { data } = await axios.get(`${BASE_URL}/api/users/public`);
  return Array.isArray(data) ? data : [];
}
