/**
 * @fileoverview EditTaskModal component.
 * Provides a modal dialog to edit an existing Kanban task.
 * Includes form fields for editing task details and a preview panel.
 *
 * @module components/modals/EditTaskModal
 */

import React, { useState, useEffect } from "react";
import {
  Modal,
  Box,
  TextField,
  Button,
  Typography,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  IconButton,
  Paper,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { updateKanbanTask } from "../../services/kanbanService.js";
import { denormalizeStatus, normalizeStatus } from "../KanbanUtils.jsx";

/**
 * EditTaskModal Component
 *
 * @function EditTaskModal
 * @param {Object} props - Component props.
 * @param {boolean} props.open - Controls whether the modal is open.
 * @param {Function} props.onClose - Callback to close the modal.
 * @param {Object} props.task - Current task object to be edited.
 * @param {string} props.task._id - Unique identifier of the task.
 * @param {string} props.task.title - Task title.
 * @param {string} props.task.description - Task description.
 * @param {string} props.task.status - Task status ("todo", "inprogress", "review", "done").
 * @param {string} props.task.priority - Task priority ("high", "medium", "low").
 * @param {string} props.task.deadline - Task deadline (ISO date string).
 * @param {Array<string>} props.task.assignees - Array of user IDs assigned to the task.
 * @param {string} props.task.listId - ID of the Kanban list containing the task.
 * @param {string} props.task.projectId - ID of the project associated with the task.
 * @param {Function} props.onTaskUpdated - Callback triggered when the task is successfully updated.
 * @returns {JSX.Element} Modal dialog for editing a Kanban task.
 */
const EditTaskModal = ({ open, onClose, task, onTaskUpdated }) => {
  const [form, setForm] = useState({ ...task });
  const [error, setError] = useState("");

  useEffect(() => {
    if (task) {
      setForm({ ...task, status: normalizeStatus(task.status) });
    }
  }, [task]);

  /**
   * Updates a specific field in the form state.
   *
   * @param {string} field - Field name to update.
   * @param {any} value - New value for the field.
   */
  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  /**
   * Validates form fields and submits the updated task to the backend.
   *
   * @async
   * @function handleSubmit
   * @returns {Promise<void>} Resolves when the task is successfully updated.
   */
  const handleSubmit = async () => {
    const { title, description, assignees, deadline, status, priority } = form;

    if (!title?.trim() || !description?.trim() || !status || !deadline) {
      setError("⚠️ All required fields must be completed.");
      return;
    }

    const deadlineDate = new Date(deadline);
    if (isNaN(deadlineDate.getTime())) {
      setError("⚠️ Invalid deadline date.");
      return;
    }

    try {
      const payload = {
        title,
        description,
        assignees: (assignees || []).map((id) => ({ _id: id })),
        status: denormalizeStatus(status),
        deadline: deadlineDate.toISOString(),
        priority,
        listId: task.listId,
        projectId: task.projectId,
        source: "kanban",
      };

      const data = await updateKanbanTask(task._id, payload);
      onTaskUpdated(data);
      onClose();
    } catch (err) {
      console.error("❌ Error updating task:", err);
      setError("Task could not be updated.");
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      {/* Modal content */}
      <Box
        sx={{
          width: 500,
          maxHeight: "80vh",
          overflowY: "auto",
          bgcolor: "background.paper",
          p: 4,
          mx: "auto",
          mt: "5%",
          borderRadius: 2,
          position: "relative",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Close button */}
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>

        {/* Modal title */}
        <Typography variant="h6" gutterBottom>
          ✏️ Edit Kanban Task
        </Typography>

        {/* Error message */}
        {error && (
          <Typography color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}

        {/* Form fields */}
        <Box sx={{ flex: 1, overflowY: "auto", pr: 1 }}>
          {/* Title */}
          <TextField
            label="📝 Title"
            fullWidth
            required
            value={form.title || ""}
            onChange={(e) => handleChange("title", e.target.value)}
            sx={{ mb: 2 }}
          />

          {/* Description */}
          <TextField
            label="📄 Description"
            fullWidth
            multiline
            rows={3}
            required
            value={form.description || ""}
            onChange={(e) => handleChange("description", e.target.value)}
            sx={{ mb: 2 }}
          />

          {/* Status */}
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={form.status || ""}
              onChange={(e) => handleChange("status", e.target.value)}
            >
              <MenuItem value="todo">📝 To Do</MenuItem>
              <MenuItem value="inprogress">🔄 In Progress</MenuItem>
              <MenuItem value="review">👀 Review</MenuItem>
              <MenuItem value="done">✅ Done</MenuItem>
            </Select>
          </FormControl>

          {/* Priority */}
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Priority</InputLabel>
            <Select
              value={form.priority || ""}
              onChange={(e) => handleChange("priority", e.target.value)}
            >
              <MenuItem value="high">⚡ High</MenuItem>
              <MenuItem value="medium">📊 Medium</MenuItem>
              <MenuItem value="low">🐢 Low</MenuItem>
            </Select>
          </FormControl>

          {/* Deadline */}
          <TextField
            label="📅 Deadline"
            type="date"
            fullWidth
            value={
              form.deadline
                ? new Date(form.deadline).toISOString().split("T")[0]
                : ""
            }
            onChange={(e) => handleChange("deadline", e.target.value)}
            sx={{ mb: 2 }}
            InputLabelProps={{ shrink: true }}
          />

          {/* Assignees */}
          <TextField
            label="👥 Assignees (comma-separated IDs)"
            fullWidth
            value={(form.assignees || []).join(",")}
            onChange={(e) =>
              handleChange(
                "assignees",
                e.target.value.split(",").map((s) => s.trim())
              )
            }
            sx={{ mb: 2 }}
          />

          {/* Preview panel */}
          <Paper sx={{ p: 2, mb: 2 }}>
            <Typography variant="subtitle2">🔎 Preview:</Typography>
            <Typography variant="body2">📌 Status: {form.status}</Typography>
            <Typography variant="body2">⚡ Priority: {form.priority}</Typography>
            <Typography variant="body2">
              📅 Deadline:{" "}
              {form.deadline
                ? new Date(form.deadline).toLocaleDateString()
                : "N/A"}
            </Typography>
          </Paper>
        </Box>

        {/* Action buttons */}
        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1, mt: 2 }}>
          <Button variant="outlined" onClick={onClose} aria-label="Cancel edit">
            ❌ Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            aria-label="Save changes"
          >
            ✅ Save
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default EditTaskModal;
