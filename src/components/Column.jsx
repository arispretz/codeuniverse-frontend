/**
 * @fileoverview Column component.
 * Represents a single Kanban column with tasks, a progress indicator,
 * and drag-and-drop functionality using `@dnd-kit`.
 *
 * @module components/Column
 */

import React from "react";
import { Grid, Typography, Paper, LinearProgress } from "@mui/material";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { AnimatePresence } from "framer-motion";
import ColumnDroppable from "./ColumnDroppable.jsx";
import SortableTask from "./SortableTask.jsx";
import { statusLabels, columnColors, getIdStr } from "./KanbanUtils.jsx";
import { isUserAssigned } from "../utils/taskUtils.js";

/**
 * Column Component
 *
 * @function Column
 * @param {Object} props - Component props.
 * @param {string} props.status - Status key for the column (e.g., `"todo"`, `"inprogress"`, `"done"`).
 * @param {Array<Object>} [props.tasks=[]] - List of tasks belonging to this column.
 * @param {Function} [props.sortTasks] - Function to sort tasks before rendering. Defaults to identity.
 * @param {Function} [props.getProgress] - Function to calculate progress percentage for tasks. Defaults to `0`.
 * @param {string} props.role - Current user role (e.g., `"manager"`, `"admin"`, `"developer"`).
 * @param {string} props.userMongoId - MongoDB user ID for permission checks.
 * @param {string} props.firebaseUid - Firebase UID for permission checks.
 * @param {Function} props.setEditingTask - Setter to mark a task for editing.
 * @param {Function} props.setViewingTask - Setter to mark a task for viewing.
 * @param {Function} props.setTaskToDelete - Setter to mark a task for deletion.
 * @param {Function} props.setActiveModal - Setter to open the appropriate modal (`"view"`, `"edit"`, `"delete"`).
 * @param {Function} props.enqueueSnackbar - Function to show feedback messages.
 * @returns {JSX.Element} Kanban column layout with tasks and drag-and-drop support.
 */
const Column = ({
  status,
  tasks = [],
  sortTasks = (arr) => arr,
  getProgress = () => 0,
  role,
  userMongoId,
  firebaseUid,
  setEditingTask,
  setViewingTask,
  setTaskToDelete,
  setActiveModal,
  enqueueSnackbar,
}) => {
  // Ensure tasks is always an array
  const safeTasks = Array.isArray(tasks) ? tasks : [];

  // Sort tasks using provided function
  const sortedTasks = Array.isArray(sortTasks(safeTasks))
    ? sortTasks(safeTasks)
    : [];

  // Calculate progress percentage
  const progress = getProgress(safeTasks);

  return (
    <Grid item xs={12} sm={6} md={3}>
      {/* Column title */}
      <Typography variant="h6" sx={{ color: columnColors[status].border }}>
        {statusLabels[status]}
      </Typography>

      {/* Progress bar */}
      <LinearProgress
        variant="determinate"
        value={progress}
        sx={{
          height: 8,
          borderRadius: 5,
          mb: 1,
          backgroundColor: columnColors[status].bg,
          "& .MuiLinearProgress-bar": {
            backgroundColor: columnColors[status].border,
          },
        }}
      />
      <Typography variant="caption" sx={{ mb: 1 }}>
        {progress}% completed
      </Typography>

      {/* Task container with drag-and-drop */}
      <Paper
        elevation={3}
        sx={{
          p: 1,
          minHeight: "300px",
          backgroundColor: columnColors[status].bg,
          border: `2px solid ${columnColors[status].border}`,
        }}
      >
        <ColumnDroppable status={status}>
          <SortableContext
            id={status}
            items={sortedTasks
              .map((t) => getIdStr(t))
              .filter((id) => id && id !== "undefined")}
            strategy={verticalListSortingStrategy}
          >
            <AnimatePresence initial={false}>
              {sortedTasks.map((task) => {
                const key = getIdStr(task);
                if (!key) return null;

                // Permission check: managers/admins or assigned users can edit/delete
                const canEditOrDelete =
                  role === "manager" ||
                  role === "admin" ||
                  isUserAssigned(task, userMongoId, firebaseUid);

                return (
                  <SortableTask
                    key={key}
                    task={task}
                    containerId={status}
                    role={role}
                    userMongoId={userMongoId}
                    firebaseUid={firebaseUid}
                    canEditOrDelete={canEditOrDelete}
                    enqueueSnackbar={enqueueSnackbar}
                    onView={() => {
                      setViewingTask(task);
                      setActiveModal("view");
                    }}
                    onEdit={
                      canEditOrDelete
                        ? () => {
                            setEditingTask(task);
                            setActiveModal("edit");
                          }
                        : undefined
                    }
                    onDelete={
                      canEditOrDelete
                        ? () => {
                            setTaskToDelete(task);
                            setActiveModal("delete");
                          }
                        : undefined
                    }
                  />
                );
              })}
            </AnimatePresence>
          </SortableContext>
        </ColumnDroppable>
      </Paper>
    </Grid>
  );
};

export default Column;
