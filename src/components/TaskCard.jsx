/**
 * @fileoverview TaskCard component.
 * Provides a reusable card UI for displaying task details in the Kanban board.
 * Shows title, description, metadata chips (status, priority, source, deadline, assignees),
 * and action icons (view, edit, delete).
 *
 * @module components/TaskCard
 */

import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Chip,
  Avatar,
  Box,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { format } from "date-fns";

/**
 * TaskCard Component
 *
 * @function TaskCard
 * @param {Object} props - Component props.
 * @param {Object} props.task - Task object containing details.
 * @param {string} [props.task.title] - Title of the task.
 * @param {string} [props.task.description] - Description of the task.
 * @param {string} [props.task.status] - Current status of the task.
 * @param {string} [props.task.priority] - Priority level of the task.
 * @param {string} [props.task.source] - Source system of the task (e.g., `"clickup"`).
 * @param {string|Date} [props.task.deadline] - Deadline date of the task.
 * @param {Array<Object|string>} [props.task.assignees] - List of assignees.
 * @param {Object|string} [props.task.assignedTo] - Single assignee if not an array.
 * @param {boolean} props.canEditOrDelete - Permission flag to allow edit/delete actions.
 * @param {Function} props.onView - Callback to view task details.
 * @param {Function} [props.onEdit] - Callback to edit task (conditionally enabled).
 * @param {Function} [props.onDelete] - Callback to delete task (conditionally enabled).
 * @returns {JSX.Element} Task card component.
 *
 * @example
 * <TaskCard
 *   task={{
 *     title: "Implement login",
 *     description: "Add Firebase authentication",
 *     status: "inprogress",
 *     priority: "high",
 *     source: "clickup",
 *     deadline: "2026-02-01",
 *     assignees: [{ name: "Ariana" }]
 *   }}
 *   canEditOrDelete={true}
 *   onView={() => console.log("View task")}
 *   onEdit={() => console.log("Edit task")}
 *   onDelete={() => console.log("Delete task")}
 * />
 */
const TaskCard = ({
  task = {},
  canEditOrDelete,
  onView,
  onEdit,
  onDelete,
}) => {
  let deadline = "No deadline";
  if (task.deadline) {
    const d = new Date(task.deadline);
    if (!isNaN(d)) {
      deadline = format(d, "dd/MM/yyyy");
    }
  }

  const assignees = Array.isArray(task.assignees)
    ? task.assignees
    : task.assignedTo
    ? [task.assignedTo]
    : [];

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        {/* Title */}
        <Typography variant="h6">{task.title || "Untitled"}</Typography>

        {/* Description */}
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          {task.description || "No description"}
        </Typography>

        {/* Metadata chips */}
        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 1 }}>
          <Chip label={`Status: ${task.status || "N/A"}`} color="info" />
          <Chip label={`Priority: ${task.priority || "N/A"}`} color="warning" />
          <Chip
            label={`Source: ${task.source || "N/A"}`}
            color={task.source === "clickup" ? "primary" : "default"}
          />
          <Chip label={`Deadline: ${deadline}`} />
          {assignees.map((a, idx) => (
            <Chip
              key={idx}
              avatar={
                <Avatar>
                  {typeof a === "string"
                    ? a[0]
                    : a?.name?.[0] || a?._id?.[0] || "?"}
                </Avatar>
              }
              label={`Assigned: ${
                typeof a === "string"
                  ? a
                  : a?.name || a?._id || "Unknown"
              }`}
            />
          ))}
        </Box>

        {/* Action icons */}
        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
          <IconButton
            onClick={onView}
            onPointerDown={(e) => e.stopPropagation()}
            title="View task"
            aria-label="View task"
          >
            <VisibilityIcon />
          </IconButton>

          {canEditOrDelete && (
            <>
              <IconButton
                onClick={onEdit}
                onPointerDown={(e) => e.stopPropagation()}
                title="Edit task"
                aria-label="Edit task"
              >
                <EditIcon />
              </IconButton>
              <IconButton
                onClick={onDelete}
                onPointerDown={(e) => e.stopPropagation()}
                title="Delete task"
                aria-label="Delete task"
              >
                <DeleteIcon />
              </IconButton>
            </>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default TaskCard;
