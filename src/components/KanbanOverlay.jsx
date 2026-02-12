/**
 * @fileoverview KanbanOverlay component.
 * Provides a visual overlay when dragging a task card in the Kanban board.
 * Uses `framer-motion` for smooth animation and applies column-specific colors
 * based on the task status.
 *
 * @module components/KanbanOverlay
 */

import React from "react";
import { DragOverlay } from "@dnd-kit/core";
import { motion } from "framer-motion";
import TaskCard from "./TaskCard.jsx";
import { columnColors, normalizeStatus } from "./KanbanUtils.jsx";

/**
 * KanbanOverlay Component
 *
 * @function KanbanOverlay
 * @param {Object} props - Component props.
 * @param {Object|null} props.activeTask - The task object currently being dragged.
 * @param {string} props.activeTask._id - Unique identifier of the task.
 * @param {string} props.activeTask.title - Title of the task.
 * @param {string} props.activeTask.status - Current status of the task (e.g., `"todo"`, `"inprogress"`, `"review"`, `"done"`).
 * @returns {JSX.Element|null} Animated overlay with the task card, or `null` if no task is active.
 *
 * @example
 * <KanbanOverlay activeTask={task} />
 */
const KanbanOverlay = ({ activeTask }) => {
  return (
    <DragOverlay>
      {activeTask ? (
        <motion.div
          initial={{ scale: 0.95, opacity: 0.85 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.2 }}
          style={{
            backgroundColor:
              columnColors[normalizeStatus(activeTask.status)]?.card ?? "#fff",
            borderRadius: 6,
            padding: 4,
          }}
        >
          <TaskCard task={activeTask} />
        </motion.div>
      ) : null}
    </DragOverlay>
  );
};

export default KanbanOverlay;
