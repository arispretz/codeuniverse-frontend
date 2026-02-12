/**
 * @fileoverview Kanban utilities.
 * Provides constants and helper functions for managing statuses, colors,
 * task IDs, and updating columns in the Kanban board.
 *
 * @module components/KanbanUtils
 */

/**
 * Internal statuses used in the Kanban board.
 *
 * @constant
 * @type {Array<string>}
 */
export const STATUSES = ["todo", "inprogress", "review", "done"];

/**
 * Human-readable labels for statuses.
 *
 * @constant
 * @type {Object<string, string>}
 */
export const statusLabels = {
  todo: "To Do",
  inprogress: "In Progress",
  review: "Review",
  done: "Done",
};

/**
 * Color palette for each column status.
 *
 * @constant
 * @type {Object<string, {bg: string, border: string, card: string}>}
 */
export const columnColors = {
  todo: { bg: "#ffebee", border: "#f44336", card: "#ffcdd2" },        // light red
  inprogress: { bg: "#e3f2fd", border: "#2196f3", card: "#bbdefb" },  // light blue
  review: { bg: "#fff8e1", border: "#ff9800", card: "#ffe0b2" },      // yellow/orange
  done: { bg: "#e8f5e9", border: "#4caf50", card: "#c8e6c9" },        // light green
};

/**
 * Normalize backend status to frontend status key.
 *
 * @function normalizeStatus
 * @param {string|Object} status - Status string or object from backend.
 * @returns {string} Normalized status key.
 *
 * @example
 * normalizeStatus("In Progress"); // "inprogress"
 */
export const normalizeStatus = (status) => {
  const key = (status?.status || status || "").toLowerCase().trim();
  const map = {
    "to do": "todo",
    todo: "todo",
    "in progress": "inprogress",
    inprogress: "inprogress",
    review: "review",
    done: "done",
  };
  return map[key] || "todo";
};

/**
 * Denormalize frontend status key to backend format.
 *
 * @function denormalizeStatus
 * @param {string} statusKey - Frontend status key.
 * @returns {string} Backend status string.
 *
 * @example
 * denormalizeStatus("inprogress"); // "in progress"
 */
export const denormalizeStatus = (statusKey) => {
  const map = {
    todo: "to do",
    "to do": "to do",
    inprogress: "in progress",
    "in progress": "in progress",
    review: "review",
    done: "done",
  };
  return map[statusKey] || "to do";
};

/**
 * Utility to get the ID string of a task (MongoDB or external system).
 *
 * @function getIdStr
 * @param {Object} t - Task object.
 * @returns {string} Task ID as string.
 *
 * @example
 * getIdStr({ _id: 123 }); // "123"
 */
export const getIdStr = (t) => {
  const id = t?._id ?? t?.id;
  return id ? String(id) : "";
};

/**
 * Compare if two IDs are equal.
 *
 * @function isSameId
 * @param {string|number} a - First ID.
 * @param {string|number} b - Second ID.
 * @returns {boolean} True if IDs are equal.
 *
 * @example
 * isSameId("123", 123); // true
 */
export const isSameId = (a, b) => {
  const sa = a ? String(a) : "";
  const sb = b ? String(b) : "";
  return sa && sb && sa === sb;
};

/**
 * Convert a value to ID string.
 *
 * @function toIdStr
 * @param {Object|string|number} v - Value containing ID.
 * @returns {string} ID as string.
 *
 * @example
 * toIdStr({ id: 456 }); // "456"
 */
export const toIdStr = (v) => {
  if (!v) return "";
  const raw = typeof v === "object" ? v._id || v.id : v;
  return raw ? String(raw) : "";
};

/**
 * Update columns when a task changes status or is edited.
 * Removes the task from its previous column and adds it to the new one.
 *
 * @function updateTaskInColumns
 * @param {Object} task - Task object with updated status.
 * @param {Object<string, Array<Object>>} prevColumns - Previous columns state.
 * @returns {Object<string, Array<Object>>} Updated columns state.
 *
 * @example
 * const updated = updateTaskInColumns({ _id: "1", status: "done" }, prevColumns);
 */
export const updateTaskInColumns = (task, prevColumns) => {
  const status = normalizeStatus(task.status);
  const taskId = getIdStr(task);

  const next = STATUSES.reduce((acc, s) => {
    acc[s] = (prevColumns[s] || []).filter((t) => getIdStr(t) !== taskId);
    return acc;
  }, {});

  next[status] = [...(next[status] || []), { ...task, status }];
  return next;
};
