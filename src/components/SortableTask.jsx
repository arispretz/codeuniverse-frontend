/**
 * @fileoverview SortableTask component.
 * Provides a draggable and sortable task card for the Kanban board.
 * Integrates with `@dnd-kit/sortable` for drag-and-drop functionality
 * and `framer-motion` for smooth animations.
 *
 * @module components/SortableTask
 */

import React from "react";
import { motion } from "framer-motion";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import TaskCard from "./TaskCard.jsx";
import { getIdStr, columnColors } from "./KanbanUtils.jsx";

/**
 * SortableTask Component
 *
 * @function SortableTask
 * @param {Object} props - Component props.
 * @param {Object} props.task - Task object containing details.
 * @param {string} props.containerId - ID of the column container the task belongs to.
 * @param {string} props.role - Current user's role (`"manager"`, `"admin"`, etc.).
 * @param {string} props.userMongoId - Current user's MongoDB ID.
 * @param {string} props.firebaseUid - Current user's Firebase UID.
 * @param {boolean} props.canEditOrDelete - Permission flag to allow edit/delete actions.
 * @param {Function} props.onView - Callback to view task details.
 * @param {Function} props.onEdit - Callback to edit task (conditionally enabled).
 * @param {Function} props.onDelete - Callback to delete task (conditionally enabled).
 * @returns {JSX.Element|null} Sortable task card component or `null` if no valid ID.
 *
 * @example
 * <SortableTask
 *   task={task}
 *   containerId="todo"
 *   role="manager"
 *   userMongoId="abc123"
 *   firebaseUid="uid456"
 *   canEditOrDelete={true}
 *   onView={() => console.log("View task")}
 *   onEdit={() => console.log("Edit task")}
 *   onDelete={() => console.log("Delete task")}
 * />
 */
const SortableTask = ({
  task,
  containerId,
  role,
  userMongoId,
  firebaseUid,
  canEditOrDelete,
  onView,
  onEdit,
  onDelete,
}) => {
  const id = getIdStr(task);
  if (!id) return null;

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id,
    data: { containerId, task },
    activationConstraint: { distance: 5 },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    marginBottom: 8,
    opacity: isDragging ? 0.4 : 1,
    backgroundColor: columnColors[containerId]?.card ?? "#fff",
    borderRadius: 6,
    padding: 4,
  };

  return (
    <motion.div
      ref={setNodeRef}
      style={{ ...style, touchAction: "none" }}
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
    >
      {/* Drag handle */}
      <div
        className="drag-handle"
        {...attributes}
        {...listeners}
        style={{
          cursor: "grab",
          padding: "4px",
          textAlign: "center",
          userSelect: "none",
          touchAction: "none",
        }}
      >
        ⋮⋮
      </div>

      {/* Task card content */}
      <TaskCard
        task={task}
        role={role}
        userMongoId={userMongoId}
        firebaseUid={firebaseUid}
        canEditOrDelete={canEditOrDelete}
        onView={onView}
        onEdit={canEditOrDelete ? onEdit : undefined}
        onDelete={canEditOrDelete ? onDelete : undefined}
      />
    </motion.div>
  );
};

export default SortableTask;
