import axios from "axios";
import { getUserToken } from "../utils/userToken.js";
import { getKanbanColumns } from "./kanbanService.js";

const BASE_URL = import.meta.env.VITE_EXPRESS_URL;
if (!BASE_URL) {
  throw new Error("Missing environment variable: VITE_EXPRESS_URL");
}

/**
 * @fileoverview Project and List API client.
 * Provides functions to interact with the Express backend for:
 * - Project management (CRUD, full projects with tasks/lists)
 * - Local lists inside projects
 * - Kanban lists and columns
 *
 * All requests require a valid Firebase ID token for authentication.
 *
 * @module services/projectService
 */

/**
 * 📦 PROJECTS
 */

/**
 * Fetch projects with pagination and search.
 *
 * @async
 * @function getProjects
 * @param {Object} [options] - Query options.
 * @param {string} [options.search] - Search term.
 * @param {number} [options.page=1] - Page number.
 * @param {number} [options.limit=10] - Items per page.
 * @returns {Promise<Object>} Projects data (paginated list).
 *
 * @example
 * const projects = await getProjects({ search: "AI", page: 2 });
 * console.log(projects.items);
 */
export async function getProjects({ search = "", page = 1, limit = 10 } = {}) {
  const token = await getUserToken(true);
  if (!token) throw new Error("User not authenticated");

  const { data } = await axios.get(`${BASE_URL}/api/projects`, {
    params: { search, page, limit },
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
}

/**
 * Fetch projects with tasks.
 *
 * @async
 * @function getProjectsWithTasks
 * @returns {Promise<Array<Object>>} Projects with their associated tasks.
 *
 * @example
 * const projects = await getProjectsWithTasks();
 * console.log(projects[0].tasks);
 */
export async function getProjectsWithTasks() {
  const token = await getUserToken(true);
  if (!token) throw new Error("User not authenticated");

  const { data } = await axios.get(`${BASE_URL}/api/projects/with-tasks`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
}

/**
 * Fetch full projects with pagination and search.
 *
 * @async
 * @function getProjectsFull
 * @param {Object} [options] - Query options.
 * @param {string} [options.search] - Search term.
 * @param {number} [options.page=1] - Page number.
 * @param {number} [options.limit=10] - Items per page.
 * @returns {Promise<Object>} Full projects data including tasks and lists.
 */
export async function getProjectsFull({ search = "", page = 1, limit = 10 } = {}) {
  const token = await getUserToken(true);
  if (!token) throw new Error("User not authenticated");

  const { data } = await axios.get(`${BASE_URL}/api/projects/full`, {
    params: { search, page, limit },
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
}

/**
 * Fetch full project by ID.
 *
 * @async
 * @function getProjectFullById
 * @param {string} id - Project ID.
 * @returns {Promise<Object>} Full project data including tasks and lists.
 */
export async function getProjectFullById(id) {
  const token = await getUserToken(true);
  if (!token) throw new Error("User not authenticated");

  const { data } = await axios.get(`${BASE_URL}/api/projects/${id}/full`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
}

/**
 * Fetch project by ID.
 *
 * @async
 * @function getProjectById
 * @param {string} id - Project ID.
 * @returns {Promise<Object>} Project data.
 */
export async function getProjectById(id) {
  const token = await getUserToken(true);
  if (!token) throw new Error("User not authenticated");

  const { data } = await axios.get(`${BASE_URL}/api/projects/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
}

/**
 * Create a new project.
 *
 * @async
 * @function createProject
 * @param {Object} payload - Project data (e.g., { name, description }).
 * @returns {Promise<Object>} Created project data.
 */
export async function createProject(payload) {
  const token = await getUserToken(true);
  if (!token) throw new Error("User not authenticated");

  const { data } = await axios.post(`${BASE_URL}/api/projects`, payload, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
}

/**
 * Create a full project with tasks and lists.
 *
 * @async
 * @function createFullProject
 * @param {Object} payload - Project data including tasks and lists.
 * @returns {Promise<Object>} Created full project data.
 */
export async function createFullProject(payload) {
  const token = await getUserToken(true);
  if (!token) throw new Error("User not authenticated");

  const { data } = await axios.post(`${BASE_URL}/api/projects/full`, payload, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
}

/**
 * 📋 LOCAL LISTS
 */

/**
 * Create a local list inside a project.
 *
 * @async
 * @function createLocalList
 * @param {string} projectId - Project ID.
 * @param {Object} payload - List data (e.g., { name }).
 * @returns {Promise<Object>} Created list data.
 */
export async function createLocalList(projectId, payload) {
  const token = await getUserToken(true);
  if (!token) throw new Error("User not authenticated");

  const { data } = await axios.post(`${BASE_URL}/api/lists`, { projectId, ...payload }, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
}

/**
 * Fetch local lists of a project.
 *
 * @async
 * @function getLocalLists
 * @param {string} projectId - Project ID.
 * @returns {Promise<Array<Object>>} List of local lists.
 */
export async function getLocalLists(projectId) {
  const token = await getUserToken(true);
  if (!token) throw new Error("User not authenticated");

  const { data } = await axios.get(`${BASE_URL}/api/lists`, {
    params: projectId ? { projectId } : undefined,
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
}

/**
 * Create a task inside a list.
 *
 * @async
 * @function createTaskInList
 * @param {string} listId - List ID.
 * @param {Object} payload - Task data (e.g., { title, description }).
 * @returns {Promise<Object>} Created task data.
 */
export async function createTaskInList(listId, payload) {
  const token = await getUserToken(true);
  if (!token) throw new Error("User not authenticated");

  const { data } = await axios.post(`${BASE_URL}/api/lists/${listId}/tasks`, payload, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
}

/**
 * Update a task inside a list.
 *
 * @async
 * @function updateTaskInList
 * @param {string} listId - List ID.
 * @param {string} taskId - Task ID.
 * @param {Object} updates - Task updates.
 * @returns {Promise<Object>} Updated task data.
 */
export async function updateTaskInList(listId, taskId, updates) {
  const token = await getUserToken(true);
  if (!token) throw new Error("User not authenticated");

  const { data } = await axios.put(`${BASE_URL}/api/lists/${listId}/tasks/${taskId}`, updates, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
}

/**
 * Delete a task inside a list.
 *
 * @async
 * @function deleteTaskInList
 * @param {string} listId - List ID.
 * @param {string} taskId - Task ID.
 * @returns {Promise<Object>} Deletion result.
 */
export async function deleteTaskInList(listId, taskId) {
  const token = await getUserToken(true);
  if (!token) throw new Error("User not authenticated");

  const { data } = await axios.delete(`${BASE_URL}/api/lists/${listId}/tasks/${taskId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
}

/**
 * 🧱 KANBAN
 */

/**
 * Create a Kanban list inside a project.
 *
 * @async
 * @function createKanbanList
 * @param {string} projectId - Project ID.
 * @param {Object} payload - Kanban list data (e.g., { name, description }).
 * @returns {Promise<Object>} Created Kanban list data.
 *
 * @example
 * const newList = await createKanbanList("proj123", { name: "Backlog" });
 * console.log(newList);
 */
export async function createKanbanList(projectId, payload) {
  const token = await getUserToken(true);
  if (!token) throw new Error("User not authenticated");

  const { data } = await axios.post(`${BASE_URL}/api/kanban/lists`, { projectId, ...payload }, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
}

/**
 * Fetch Kanban lists of a project.
 *
 * @async
 * @function getKanbanLists
 * @param {Object} [options] - Options for filtering lists.
 * @param {string} [options.projectId] - Project ID.
 * @returns {Promise<Array<Object>>} List of Kanban lists.
 *
 * @example
 * const lists = await getKanbanLists({ projectId: "proj123" });
 * console.log(lists);
 */
export async function getKanbanLists({ projectId } = {}) {
  const token = await getUserToken(true);
  if (!token) throw new Error("User not authenticated");

  const { data } = await axios.get(`${BASE_URL}/api/kanban/lists`, {
    params: projectId ? { projectId } : undefined,
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
}

/**
 * Fetch Kanban columns of a project.
 *
 * @async
 * @function fetchProjectKanbanColumns
 * @param {Object} options - Options for filtering columns (e.g., { projectId, listId }).
 * @returns {Promise<Object>} Kanban columns data.
 *
 * @example
 * const columns = await fetchProjectKanbanColumns({ projectId: "proj123" });
 * console.log(columns);
 */
export async function fetchProjectKanbanColumns(options) {
  return await getKanbanColumns(options);
}
