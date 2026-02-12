import axios from "axios";
import { getUserToken } from "../utils/userToken.js";
import { normalizeStatus, denormalizeStatus } from "../components/KanbanUtils.jsx";

const BASE_URL = import.meta.env.VITE_EXPRESS_URL;
if (!BASE_URL) {
  throw new Error("Missing environment variable: VITE_EXPRESS_URL");
}

/**
 * @fileoverview Task API client.
 * Provides functions to interact with the Express backend for:
 * - Local tasks (linked to projects/lists)
 * - Personal tasks (user-specific)
 * - Tasks by list ID
 *
 * All requests require a valid Firebase ID token for authentication.
 *
 * @module services/taskService
 */

/**
 * 📌 LOCAL TASKS
 */

/**
 * Fetch local tasks.
 *
 * @async
 * @function getLocalTasks
 * @param {string} projectId - Project ID.
 * @param {string|null} [assignedUserId=null] - User ID assigned to the task.
 * @returns {Promise<Array<Object>>} List of normalized local tasks.
 * @throws {Error} If user is not authenticated.
 *
 * @example
 * const tasks = await getLocalTasks("proj123", "user456");
 * console.log(tasks[0].status); // normalized status
 */
export async function getLocalTasks(projectId, assignedUserId = null) {
  const token = await getUserToken(true);
  if (!token) throw new Error("User not authenticated");

  const params = {};
  if (projectId) params.projectId = projectId;
  if (assignedUserId) params.assignedTo = assignedUserId;

  const { data } = await axios.get(`${BASE_URL}/api/tasks/local`, {
    params,
    headers: { Authorization: `Bearer ${token}` },
  });

  const tasks = Array.isArray(data)
    ? data
    : Array.isArray(data.items)
    ? data.items
    : Array.isArray(data.tasks)
    ? data.tasks
    : [];

  return tasks.map((t) => ({ ...t, status: normalizeStatus(t.status) }));
}

/**
 * Create a local task.
 *
 * @async
 * @function createLocalTask
 * @param {string} listId - List ID.
 * @param {Object} payload - Task data (e.g., { title, description, status, assignedTo }).
 * @returns {Promise<Object>} Created task with normalized status.
 */
export async function createLocalTask(listId, payload) {
  const token = await getUserToken(true);
  if (!token) throw new Error("User not authenticated");

  const backendPayload = {
    ...payload,
    listId,
    status: denormalizeStatus(payload.status || "to do"),
    assignedTo: payload.assignedTo || null,
  };

  const { data } = await axios.post(`${BASE_URL}/api/lists/${listId}/tasks`, backendPayload, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return { ...data, status: normalizeStatus(data.status) };
}

/**
 * Update a local task.
 *
 * @async
 * @function updateLocalTask
 * @param {string} listId - List ID.
 * @param {string} taskId - Task ID.
 * @param {Object} updates - Task updates.
 * @returns {Promise<Object>} Updated task with normalized status.
 */
export async function updateLocalTask(listId, taskId, updates) {
  const token = await getUserToken(true);
  if (!token) throw new Error("User not authenticated");

  const backendPayload = {
    ...updates,
    listId,
    status: updates.status ? denormalizeStatus(updates.status) : undefined,
    assignedTo: updates.assignedTo || null,
  };

  const { data } = await axios.put(
    `${BASE_URL}/api/lists/${listId}/tasks/${taskId}`,
    backendPayload,
    { headers: { Authorization: `Bearer ${token}` } }
  );

  if (!data) throw new Error("No response received when updating local task");

  return { ...data, status: normalizeStatus(data.status) };
}

/**
 * Delete a local task.
 *
 * @async
 * @function deleteLocalTask
 * @param {string} listId - List ID.
 * @param {string} taskId - Task ID.
 * @returns {Promise<Object>} Deletion result.
 */
export async function deleteLocalTask(listId, taskId) {
  const token = await getUserToken(true);
  if (!token) throw new Error("User not authenticated");

  const { data } = await axios.delete(`${BASE_URL}/api/lists/${listId}/tasks/${taskId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return data;
}

/**
 * 📌 PERSONAL TASKS
 */

/**
 * Fetch personal tasks.
 *
 * @async
 * @function getPersonalTasks
 * @returns {Promise<Array<Object>>} List of normalized personal tasks.
 */
export async function getPersonalTasks() {
  const token = await getUserToken(true);
  if (!token) throw new Error("User not authenticated");

  const { data } = await axios.get(`${BASE_URL}/api/tasks/personal`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const tasks = Array.isArray(data)
    ? data
    : Array.isArray(data.items)
    ? data.items
    : Array.isArray(data.tasks)
    ? data.tasks
    : [];

  return tasks.map((t) => ({ ...t, status: normalizeStatus(t.status) }));
}

/**
 * Create a personal task.
 *
 * @async
 * @function createPersonalTask
 * @param {Object} payload - Task data (e.g., { title, description, status }).
 * @returns {Promise<Object>} Created task with normalized status.
 */
export async function createPersonalTask(payload) {
  const token = await getUserToken(true);
  if (!token) throw new Error("User not authenticated");

  const { data } = await axios.post(`${BASE_URL}/api/tasks/personal`, payload, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return { ...data, status: normalizeStatus(data.status) };
}

/**
 * Update a personal task.
 *
 * @async
 * @function updatePersonalTask
 * @param {string} id - Task ID.
 * @param {Object} updates - Task updates.
 * @returns {Promise<Object>} Updated task with normalized status.
 */
export async function updatePersonalTask(id, updates) {
  const token = await getUserToken(true);
  if (!token) throw new Error("User not authenticated");

  const backendPayload = {
    ...updates,
    status: updates.status ? denormalizeStatus(updates.status) : undefined,
  };

  const { data } = await axios.put(`${BASE_URL}/api/tasks/personal/${id}`, backendPayload, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return { ...data, status: normalizeStatus(data.status) };
}

/**
 * Delete a personal task.
 *
 * @async
 * @function deletePersonalTask
 * @param {string} id - Task ID.
 * @returns {Promise<Object>} Deletion result.
 */
export async function deletePersonalTask(id) {
  const token = await getUserToken(true);
  if (!token) throw new Error("User not authenticated");

  const { data } = await axios.delete(`${BASE_URL}/api/tasks/personal/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return data;
}

/**
 * Fetch a personal task by ID.
 *
 * @async
 * @function getPersonalTaskById
 * @param {string} id - Task ID.
 * @returns {Promise<Object>} Task data with normalized status.
 */
export async function getPersonalTaskById(id) {
  const token = await getUserToken(true);
  if (!token) throw new Error("User not authenticated");

  const { data } = await axios.get(`${BASE_URL}/api/tasks/personal/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return { ...data, status: normalizeStatus(data.status) };
}

/**
 * 📌 TASKS BY LIST
 */

/**
 * Fetch tasks by list ID.
 *
 * @async
 * @function getTasksByListId
 * @param {string} listId - List ID.
 * @returns {Promise<Array<Object>>} List of normalized tasks belonging to the list.
 */
export async function getTasksByListId(listId) {
  const token = await getUserToken(true);
  if (!token) throw new Error("User not authenticated");

  const { data } = await axios.get(`${BASE_URL}/api/lists/${listId}/tasks`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const tasks = Array.isArray(data)
    ? data
    : Array.isArray(data.items)
    ? data.items
    : Array.isArray(data.tasks)
    ? data.tasks
    : [];

  return tasks.map((t) => ({ ...t, status: normalizeStatus(t.status) }));
}
