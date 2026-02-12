/**
 * @fileoverview ColumnDroppable component.
 * Defines a droppable area for tasks in a Kanban column using `@dnd-kit/core`.
 * Highlights the column when a draggable item is hovered over it.
 *
 * @module components/ColumnDroppable
 */

import React from "react";
import { useDroppable } from "@dnd-kit/core";
import { Paper } from "@mui/material";
import { columnColors } from "./KanbanUtils.jsx";

/**
 * ColumnDroppable Component
 *
 * @function ColumnDroppable
 * @param {Object} props - Component props.
 * @param {string} props.status - Status identifier for the column (e.g., `"todo"`, `"inprogress"`, `"review"`, `"done"`).
 * @param {JSX.Element|JSX.Element[]} props.children - Child components (usually tasks) to render inside the column.
 * @returns {JSX.Element} Droppable column container with hover highlighting.
 *
 * @example
 * <ColumnDroppable status="todo">
 *   <TaskCard title="Fix bug #123" />
 *   <TaskCard title="Implement feature X" />
 * </ColumnDroppable>
 */
const ColumnDroppable = ({ status, children }) => {
  const { setNodeRef, isOver } = useDroppable({
    id: status,
    data: { containerId: status },
  });

  return (
    <Paper
      ref={setNodeRef}
      elevation={3}
      sx={{
        p: 1,
        minHeight: "300px",
        backgroundColor: isOver ? "rgba(0,0,0,0.05)" : columnColors[status].bg,
        border: `2px solid ${columnColors[status].border}`,
        transition: "background-color 0.2s ease",
      }}
    >
      {children}
    </Paper>
  );
};

export default ColumnDroppable;
