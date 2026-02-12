/**
 * @fileoverview AddKanbanTaskModal component.
 * Provides a modal form to create a new Kanban task.
 * Fetches available users, validates input fields, and submits the task to the backend.
 *
 * @module components/modals/AddKanbanTaskModal
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
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { getPublicUsers } from "../../services/userService.js";
import { createKanbanTask } from "../../services/kanbanService.js";

/**
 * AddKanbanTaskModal Component
 *
 * @function AddKanbanTaskModal
 * @param {Object} props - Component props.
 * @param {boolean} props.open - Controls whether the modal is open.
 * @param {Function} props.onClose - Callback to close the modal.
 * @param {Function} props.onTaskAdded - Callback triggered when a task is successfully added.
 * @param {string} props.listId - ID of the Kanban list where the task will be created.
 * @param {string} props.projectId - ID of the project associated with the task.
 * @returns {JSX.Element} Modal form for creating a Kanban task.
 */
const AddKanbanTaskModal = ({ open, onClose, onTaskAdded, listId, projectId }) => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    status: "todo", // normalized values: "todo", "in_progress", "review", "done"
    assignedTo: "", // assigned user ID
    priority: "medium", // values: "high", "medium", "low"
    deadline: "", // date string, converted to ISO later
    tags: [], // default empty array
  });

  const [error, setError] = useState("");
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (open) {
      getPublicUsers()
        .then((data) => setUsers(data))
        .catch((err) => {
          console.error("❌ Error loading users:", err);
          setUsers([]);
        });
    }
  }, [open]);

  /**
   * Handles form field changes.
   *
   * @param {string} field - Field name to update.
   * @param {string} value - New value for the field.
   */
  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  /**
   * Creates a new Kanban task by sending payload to backend.
   *
   * @async
   * @param {Object} formData - Form data containing task details.
   * @param {string} formData.title - Task title.
   * @param {string} formData.description - Task description.
   * @param {string} formData.status - Task status ("todo", "in_progress", "review", "done").
   * @param {string} formData.assignedTo - ID of the assigned user.
   * @param {string} formData.priority - Task priority ("high", "medium", "low").
   * @param {string} [formData.deadline] - Optional deadline date string.
   * @param {Array<string>} [formData.tags] - Optional tags for the task.
   * @returns {Promise<void>} Resolves when the task is successfully created.
   */
  const createTask = async (formData) => {
    try {
      const payload = {
        title: formData.title,
        description: formData.description,
        status: formData.status,
        projectId,
        deadline: formData.deadline ? new Date(formData.deadline).toISOString() : null,
        assignees: formData.assignedTo ? [formData.assignedTo] : [],
        priority: formData.priority,
        tags: formData.tags,
        source: "kanban",
      };

      const data = await createKanbanTask(listId, payload);
      onTaskAdded(data);
      onClose();
    } catch (err) {
      console.error("❌ Error creating Kanban task:", err.message);
      setError("There was a problem creating the task.");
    }
  };

  /**
   * Validates form fields and triggers task creation.
   *
   * @async
   * @returns {Promise<void>} Resolves when validation passes and task is created.
   */
  const handleSubmit = async () => {
    const { title, description, assignedTo, status, priority, deadline } = form;

    if (!title?.trim()) {
      setError("⚠️ Title is required.");
      return;
    }

    if (!description?.trim()) {
      setError("⚠️ Description is required.");
      return;
    }

    if (!assignedTo) {
      setError("⚠️ You must assign the task to a user.");
      return;
    }

    if (!listId || !projectId) {
      setError("⚠️ Missing project or list information.");
      return;
    }

    const validStatuses = ["todo", "in_progress", "review", "done"];
    if (!status || !validStatuses.includes(status)) {
      setError("⚠️ Invalid task status.");
      return;
    }

    const validPriorities = ["high", "medium", "low"];
    if (!priority || !validPriorities.includes(priority)) {
      setError("⚠️ Priority must be high, medium, or low.");
      return;
    }

    if (deadline && isNaN(new Date(deadline).getTime())) {
      setError("⚠️ Invalid deadline date.");
      return;
    }

    try {
      await createTask(form);
      setError("");
    } catch (err) {
      console.error("❌ Error creating task:", err);
      setError("There was a problem creating the task.");
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      {/* Modal content */}
      <Box
        sx={{
          width: 400,
          maxHeight: "80vh",
          overflowY: "auto",
          bgcolor: "background.paper",
          p: 4,
          mx: "auto",
          mt: "5%",
          borderRadius: 2,
          position: "relative",
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

        <Typography variant="h6" gutterBottom>
          ➕ Add Kanban Task
        </Typography>
        {error && (
          <Typography color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}

        {/* Form fields */}
        {/* Title */}
        <TextField
          label="📝 Title"
          fullWidth
          required
          value={form.title}
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
          value={form.description}
          onChange={(e) => handleChange("description", e.target.value)}
          sx={{ mb: 2 }}
        />

        {/* Status */}
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={form.status}
            label="Status"
            onChange={(e) => handleChange("status", e.target.value)}
          >
            <MenuItem value="todo">📝 To Do</MenuItem>
            <MenuItem value="in_progress">🔄 In Progress</MenuItem>
            <MenuItem value="review">👀 Review</MenuItem>
            <MenuItem value="done">✅ Done</MenuItem>
          </Select>
        </FormControl>

        {/* Assigned To */}
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Assigned To</InputLabel>
          <Select
            value={form.assignedTo}
            onChange={(e) => handleChange("assignedTo", e.target.value)}
          >
            {users.length === 0 ? (
              <MenuItem disabled>🚫 No users available</MenuItem>
            ) : (
              users.map((user) => (
                <MenuItem key={user._id} value={user._id}>
                  <Box>
                    <Typography variant="body1">👤 {user.username}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      📧 {user.email}
                    </Typography>
                  </Box>
                </MenuItem>
              ))
            )}
          </Select>
        </FormControl>

        {/* Priority */}
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Priority</InputLabel>
          <Select
            value={form.priority || "medium"}
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
          InputLabelProps={{ shrink: true }}
          value={form.deadline || ""}
          onChange={(e) => handleChange("deadline", e.target.value)}
          sx={{ mb: 2 }}
        />

        {/* Action buttons */}
        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
          <Button variant="outlined" onClick={onClose}>
            ❌ Cancel
          </Button>
          <Button variant="contained" onClick={handleSubmit}>
            ✅ Create
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default AddKanbanTaskModal;
