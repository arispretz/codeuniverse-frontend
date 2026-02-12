import axios from "axios";
import { getUserToken } from "../utils/userToken.js";
import { denormalizeStatus } from "../components/KanbanUtils.jsx";

const BASE_URL = import.meta.env.VITE_EXPRESS_URL;
if (!BASE_URL) {
  throw new Error("Missing environment variable: VITE_EXPRESS_URL");
}

/**
 * @fileoverview Kanban API client.
 * Provides functions to interact with the Express backend for Kanban board management:
 * - Fetch tasks and columns
 * - Create, update, move, and delete tasks
 * - Add comments to tasks
 *
 * All requests require a valid Firebase ID token for authentication.
 *
 * @module services/kanbanService
 */

/**
 * Fetch all Kanban tasks.
 *
 * @async
 * @function getKanbanTasks
 * @returns {Promise<Array<Object>>} List of Kanban tasks.
 * @throws {Error} If user is not authenticated.
 *
 * @example
 * const tasks = await getKanbanTasks();
 * console.log(tasks);
 */
export async function getKanbanTasks() {
  const token = await getUserToken(true);
  if (!token) throw new Error("User not authenticated");

  const { data } = await axios.get(`${BASE_URL}/api/tasks/kanban`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return Array.isArray(data) ? data : [];
}

/**
 * Fetch Kanban columns for a project or list.
 *
 * @async
 * @function getKanbanColumns
 * @param {Object} [options={}] - Options for filtering columns.
 * @param {string} [options.projectId] - Project ID.
 * @param {string} [options.listId] - List ID.
 * @returns {Promise<Object>} Kanban columns data.
 *
 * @example
 * const columns = await getKanbanColumns({ projectId: "proj123" });
 * console.log(columns);
 */
export async function getKanbanColumns({ projectId, listId } = {}) {
  const token = await getUserToken(true);
  if (!token) throw new Error("User not authenticated");

  const params = {};
  if (projectId) params.projectId = projectId;
  if (listId) params.listId = listId;

  const { data } = await axios.get(`${BASE_URL}/api/kanban/columns`, {
    params,
    headers: { Authorization: `Bearer ${token}` },
  });

  return data || {};
}

/**
 * Create a Kanban task in a specific list.
 *
 * @async
 * @function createKanbanTask
 * @param {string} listId - List ID.
 * @param {Object} payload - Task data (e.g., { title, description, status, assignees }).
 * @returns {Promise<Object>} Created task data.
 *
 * @example
 * const newTask = await createKanbanTask("list123", { title: "New Task" });
 * console.log(newTask);
 */
export async function createKanbanTask(listId, payload) {
  const token = await getUserToken(true);
  if (!token) throw new Error("User not authenticated");

  const backendPayload = {
    ...payload,
    status: denormalizeStatus(payload.status || "to do"),
    assignees: payload.assignees || (payload.assignedTo ? [payload.assignedTo] : []),
  };

  const { data } = await axios.post(
    `${BASE_URL}/api/tasks/kanban/${listId}`,
    backendPayload,
    { headers: { Authorization: `Bearer ${token}` } }
  );

  return data;
}

/**
 * Update a Kanban task.
 *
 * @async
 * @function updateKanbanTask
 * @param {string} taskId - Task ID.
 * @param {Object} updates - Task updates (e.g., { title, description, status }).
 * @returns {Promise<Object>} Updated task data.
 *
 * @example
 * const updatedTask = await updateKanbanTask("task123", { status: "done" });
 * console.log(updatedTask);
 */
export async function updateKanbanTask(taskId, updates) {
  const token = await getUserToken(true);
  if (!token) throw new Error("User not authenticated");

  const backendUpdates = {
    ...updates,
    status: denormalizeStatus(updates.status || "to do"),
  };

  const { data } = await axios.put(
    `${BASE_URL}/api/tasks/kanban/${taskId}`,
    backendUpdates,
    { headers: { Authorization: `Bearer ${token}` } }
  );

  return data;
}

/**
 * Move a Kanban task between columns.
 *
 * @async
 * @function moveKanbanTask
 * @param {string} taskId - Task ID.
 * @param {string} newStatus - New status for the task.
 * @returns {Promise<Object>} Updated task data.
 *
 * @example
 * const movedTask = await moveKanbanTask("task123", "in progress");
 * console.log(movedTask);
 */
export async function moveKanbanTask(taskId, newStatus) {
  const token = await getUserToken(true);
  if (!token) throw new Error("User not authenticated");

  const backendStatusValue = denormalizeStatus(newStatus);

  const { data } = await axios.patch(
    `${BASE_URL}/api/tasks/kanban/${taskId}/move`,
    { status: backendStatusValue },
    { headers: { Authorization: `Bearer ${token}` } }
  );

  return data;
}

/**
 * Delete a Kanban task.
 *
 * @async
 * @function deleteKanbanTask
 * @param {string} taskId - Task ID.
 * @returns {Promise<Object>} Deletion result.
 *
 * @example
 * await deleteKanbanTask("task123");
 */
export async function deleteKanbanTask(taskId) {
  const token = await getUserToken(true);
  if (!token) throw new Error("User not authenticated");

  const { data } = await axios.delete(`${BASE_URL}/api/tasks/kanban/${taskId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
}

/**
 * Add a comment to a Kanban task.
 *
 * @async
 * @function addKanbanComment
 * @param {string} taskId - Task ID.
 * @param {string} text - Comment text.
 * @returns {Promise<Object>} Created comment data.
 *
 * @example
 * const comment = await addKanbanComment("task123", "This needs review");
 * console.log(comment);
 */
export async function addKanbanComment(taskId, text) {
  const token = await getUserToken(true);
  if (!token) throw new Error("User not authenticated");

  const { data } = await axios.post(
    `${BASE_URL}/api/tasks/kanban/${taskId}/comments`,
    { text },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return data;
}
