/**
 * @fileoverview Utility to check if the authenticated user is assigned to a task.
 * Supports both MongoDB `_id` and Firebase `uid` identifiers.
 *
 * @module utils/taskUtils
 */

/**
 * Checks if the authenticated user is assigned to a task.
 * Works with MongoDB IDs (`_id`) and Firebase UIDs.
 *
 * @function isUserAssigned
 * @param {Object} task - Task document containing assignment information.
 * @param {string|null} currentUserMongoId - User's MongoDB `_id`.
 * @param {string|null} currentFirebaseUid - User's Firebase UID.
 * @returns {boolean} True if the user is assigned, false otherwise.
 *
 * @example
 * const task = {
 *   assignedTo: { _id: "12345" },
 *   assignees: [{ _id: "67890" }, { uid: "firebase-uid-abc" }]
 * };
 *
 * const isAssigned = isUserAssigned(task, "12345", "firebase-uid-abc");
 * console.log(isAssigned); // true
 */
export const isUserAssigned = (task, currentUserMongoId, currentFirebaseUid) => {
  if (!task) return false;

  const mongoId = currentUserMongoId ? String(currentUserMongoId) : "";
  const firebaseUid = currentFirebaseUid ? String(currentFirebaseUid) : "";

  // 🔹 Case 1: Direct assignment
  if (task.assignedTo) {
    // Can be a string or an object with _id
    const assignedId =
      typeof task.assignedTo === "object"
        ? String(task.assignedTo._id || "")
        : String(task.assignedTo);

    if (assignedId === mongoId || assignedId === firebaseUid) {
      return true;
    }
  }

  // 🔹 Case 2: Multiple assignees
  if (Array.isArray(task.assignees)) {
    return task.assignees.some((a) => {
      const assigneeId = a?._id ? String(a._id) : "";
      const assigneeUid = a?.uid ? String(a.uid) : "";

      return assigneeId === mongoId || assigneeUid === firebaseUid;
    });
  }

  return false;
};
