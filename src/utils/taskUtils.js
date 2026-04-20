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

  const mongoId = String(currentUserMongoId || "");
  const firebaseUid = String(currentFirebaseUid || "");

  if (task.assignedTo && String(task.assignedTo) === mongoId) return true;

  if (Array.isArray(task.assignees)) {
    return task.assignees.some(
      (a) => String(a) === mongoId || String(a) === firebaseUid
    );
  }

  return false;
};


