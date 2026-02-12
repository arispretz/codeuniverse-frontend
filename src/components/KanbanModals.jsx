/**
 * @fileoverview KanbanModals component.
 * Provides a centralized wrapper for all modal dialogs used in the Kanban board:
 * - Add task modal ➕
 * - Edit task modal ✏️
 * - View task modal 👀
 * - Delete task modal 🗑️
 *
 * @module components/KanbanModals
 */

import React from "react";
import AddKanbanTaskModal from "./modals/AddKanbanTaskModal.jsx";
import EditTaskModal from "./modals/EditTaskModal.jsx";
import TaskDetailModal from "./modals/TaskDetailModal.jsx";
import DeleteTaskModal from "./modals/DeleteTaskModal.jsx";

/**
 * KanbanModals Component
 *
 * @function KanbanModals
 * @param {Object} props - Component props.
 * @param {string} props.activeModal - Current active modal type (`"create"`, `"edit"`, `"view"`, `"delete"`).
 * @param {Function} props.setActiveModal - Function to set the active modal.
 * @param {Object|null} props.taskToDelete - Task object to be deleted.
 * @param {Function} props.insertTask - Callback when a new task is added.
 * @param {string} props.selectedListId - ID of the selected list.
 * @param {string} props.activeProjectId - ID of the active project.
 * @param {Object|null} props.viewingTask - Task object being viewed.
 * @param {Function} props.setViewingTask - Function to set the task being viewed.
 * @param {Function} props.handleNewComment - Callback when a new comment is added.
 * @param {Function} props.handleTaskUpdated - Callback when a task is updated.
 * @param {Object|null} props.editingTask - Task object being edited.
 * @param {Function} props.setEditingTask - Function to set the task being edited.
 * @param {Function} props.handleDelete - Callback when a task is deleted.
 * @returns {JSX.Element} Rendered modals depending on the active state.
 *
 * @example
 * <KanbanModals
 *   activeModal="edit"
 *   setActiveModal={setActiveModal}
 *   taskToDelete={task}
 *   insertTask={handleInsertTask}
 *   selectedListId="list123"
 *   activeProjectId="project456"
 *   viewingTask={task}
 *   setViewingTask={setViewingTask}
 *   handleNewComment={handleNewComment}
 *   handleTaskUpdated={handleTaskUpdated}
 *   editingTask={task}
 *   setEditingTask={setEditingTask}
 *   handleDelete={handleDelete}
 * />
 */
const KanbanModals = ({
  activeModal,
  setActiveModal,
  taskToDelete,
  insertTask,
  selectedListId,
  activeProjectId,
  viewingTask,
  setViewingTask,
  handleNewComment,
  handleTaskUpdated,
  editingTask,
  setEditingTask,
  handleDelete,
}) => {
  return (
    <>
      {/* Add Task Modal */}
      <AddKanbanTaskModal
        open={activeModal === "create"}
        onClose={() => setActiveModal(null)}
        onTaskAdded={insertTask}
        listId={selectedListId}
        projectId={activeProjectId}
      />

      {/* Edit Task Modal */}
      <EditTaskModal
        open={activeModal === "edit"}
        onClose={() => {
          setEditingTask(null);
          setActiveModal(null);
        }}
        task={editingTask}
        onTaskUpdated={(updated) => {
          handleTaskUpdated(updated);
          setEditingTask(null);
          setActiveModal(null);
        }}
      />

      {/* View Task Modal */}
      <TaskDetailModal
        open={activeModal === "view"}
        onClose={() => {
          setViewingTask(null);
          setActiveModal(null);
        }}
        task={viewingTask}
        avatars={{}}
        onCommentAdded={(comment) => handleNewComment(comment)}
      />

      {/* Delete Task Modal */}
      <DeleteTaskModal
        open={activeModal === "delete"}
        onClose={() => setActiveModal(null)}
        task={taskToDelete}
        onTaskDeleted={(deleted) => {
          handleDelete(deleted);
          setActiveModal(null);
        }}
      />
    </>
  );
};

export default KanbanModals;
