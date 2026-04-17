/**
 * Checks if the authenticated user is assigned to a task.
 * Works with MongoDB IDs (`_id`) and Firebase UIDs.
 *
 * @function isUserAssigned
 * @param {Object} task - Task document containing assignment information.
 * @param {string|null} currentUserMongoId - User's MongoDB `_id`.
 * @param {string|null} currentFirebaseUid - User's Firebase UID.
 * @returns {boolean} True if the user is assigned, false otherwise.
 */
export const isUserAssigned = (task, currentUserMongoId, currentFirebaseUid) => {
  if (!task) return false;

  const mongoId = currentUserMongoId ? String(currentUserMongoId) : "";
  const firebaseUid = currentFirebaseUid ? String(currentFirebaseUid) : "";

  // 🔹 Case 1: Multiple assignees (array of IDs or populated users)
  if (Array.isArray(task.assignees)) {
    return task.assignees.some((a) => {
      // Puede ser un string (por toJSON) o un objeto con _id
      const assigneeId = typeof a === "string" ? a : String(a?._id || "");
      const assigneeUid = a?.uid ? String(a.uid) : "";

      return assigneeId === mongoId || assigneeUid === firebaseUid;
    });
  }

  return false;
};
