import axios from "axios";
import { getUserToken } from "../utils/userToken.js";

const API_URL = `${import.meta.env.VITE_EXPRESS_URL}/api`;
if (!API_URL) {
  throw new Error("Missing environment variable: VITE_EXPRESS_URL");
}

/**
 * @fileoverview Project Files API client.
 * Provides functions to interact with the backend for project file management:
 * - Fetch file tree
 * - Create, rename, move, delete files/folders
 * - Retrieve and update file contents
 *
 * All requests require a valid Firebase ID token for authentication.
 *
 * @module services/fileService
 */

/**
 * Fetch project file tree.
 *
 * @async
 * @function getProjectFileTree
 * @param {string} projectId - Project identifier.
 * @returns {Promise<Object>} Project file tree structure.
 * @throws {Error} If user is not authenticated.
 *
 * @example
 * const tree = await getProjectFileTree("project123");
 * console.log(tree);
 */
export async function getProjectFileTree(projectId) {
  const token = await getUserToken(true);
  if (!token) throw new Error("User not authenticated");

  const { data } = await axios.get(`${API_URL}/project-files/${projectId}/tree`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
}

/**
 * Create a new file or folder.
 *
 * @async
 * @function createProjectFile
 * @param {Object} payload - File or folder data (e.g., { name, type, parentId }).
 * @returns {Promise<Object>} Created file/folder information.
 *
 * @example
 * const newFile = await createProjectFile({ name: "index.js", type: "file", parentId: "root" });
 * console.log(newFile);
 */
export async function createProjectFile(payload) {
  const token = await getUserToken(true);
  if (!token) throw new Error("User not authenticated");

  const { data } = await axios.post(`${API_URL}/project-files`, payload, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
}

/**
 * Rename a file or folder.
 *
 * @async
 * @function renameProjectFile
 * @param {string} id - File or folder ID.
 * @param {string} newName - New name for the file/folder.
 * @returns {Promise<Object>} Updated file/folder information.
 *
 * @example
 * const updated = await renameProjectFile("file123", "main.js");
 * console.log(updated);
 */
export async function renameProjectFile(id, newName) {
  const token = await getUserToken(true);
  if (!token) throw new Error("User not authenticated");

  const { data } = await axios.put(
    `${API_URL}/project-files/${id}`,
    { name: newName },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return data;
}

/**
 * Delete a file or folder.
 *
 * @async
 * @function deleteProjectFile
 * @param {string} id - File or folder ID.
 * @returns {Promise<Object>} Deletion result.
 *
 * @example
 * await deleteProjectFile("file123");
 */
export async function deleteProjectFile(id) {
  const token = await getUserToken(true);
  if (!token) throw new Error("User not authenticated");

  const { data } = await axios.delete(`${API_URL}/project-files/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
}

/**
 * Move a file or folder to a new parent.
 *
 * @async
 * @function moveProjectFile
 * @param {string} id - File or folder ID.
 * @param {string} newParentId - New parent folder ID.
 * @returns {Promise<Object>} Updated file/folder information.
 *
 * @example
 * const moved = await moveProjectFile("file123", "folder456");
 * console.log(moved);
 */
export async function moveProjectFile(id, newParentId) {
  const token = await getUserToken(true);
  if (!token) throw new Error("User not authenticated");

  const { data } = await axios.put(
    `${API_URL}/project-files/${id}`,
    { parentId: newParentId },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return data;
}

/**
 * Retrieve a file.
 *
 * @async
 * @function getProjectFile
 * @param {string} fileId - File ID.
 * @returns {Promise<Object>} File content and metadata.
 *
 * @example
 * const file = await getProjectFile("file123");
 * console.log(file.content);
 */
export async function getProjectFile(fileId) {
  const token = await getUserToken(true);
  if (!token) throw new Error("User not authenticated");

  const { data } = await axios.get(`${API_URL}/project-files/${fileId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
}

/**
 * Update and save a file.
 *
 * @async
 * @function updateProjectFile
 * @param {string} fileId - File ID.
 * @param {Object} payload - Updated file content (e.g., { content: "...", name?: "..." }).
 * @returns {Promise<Object>} Updated file information.
 *
 * @example
 * const updated = await updateProjectFile("file123", { content: "console.log('Hello');" });
 * console.log(updated);
 */
export async function updateProjectFile(fileId, payload) {
  const token = await getUserToken(true);
  if (!token) throw new Error("User not authenticated");

  const { data } = await axios.put(`${API_URL}/project-files/${fileId}`, payload, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
}
