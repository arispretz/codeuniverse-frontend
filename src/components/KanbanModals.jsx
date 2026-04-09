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
  onTaskAdded,         
}) => {
  return (
    <>
      {/* Add Task Modal */}
      <AddKanbanTaskModal
        open={activeModal === "create"}
        onClose={() => setActiveModal(null)}
        onTaskAdded={onTaskAdded}   
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
