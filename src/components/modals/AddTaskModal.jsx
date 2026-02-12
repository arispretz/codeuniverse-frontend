/**
 * @fileoverview AddTaskModal component.
 * Provides a modal form to create a new local task within a project.
 * Fetches available users, validates input fields, and submits the task to the backend.
 *
 * @module components/modals/AddTaskModal
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
import { createLocalTask } from "../../services/taskService.js";
import { denormalizeStatus } from "../KanbanUtils.jsx";

/**
 * AddTaskModal Component
 *
 * @function AddTaskModal
 * @param {Object} props - Component props.
 * @param {boolean} props.open - Controls whether the modal is open.
 * @param {Function} props.onClose - Callback to close the modal.
 * @param {Function} props.onTaskAdded - Callback triggered when a task is successfully added.
 * @param {string} props.listId - ID of the list where the task will be created.
 * @param {string} props.projectId - ID of the project associated with the task.
 * @returns {JSX.Element} Modal form for creating a local task.
 */
const AddTaskModal = ({ open, onClose, onTaskAdded, listId, projectId }) => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    status: "todo",
    assignees: [],
    priority: "medium", // normalized values: "high", "medium", "low"
    deadline: "",
    tags: [],
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
   * @param {string|Array<string>} value - New value for the field.
   */
  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  /**
   * Creates a new local task by sending payload to backend.
   *
   * @async
   * @param {Object} formData - Form data containing task details.
   * @param {string} formData.title - Task title.
   * @param {string} formData.description - Task description.
   * @param {string} formData.status - Task status ("todo", "inprogress", "review", "done").
   * @param {Array<string>} formData.assignees - Array of user IDs assigned to the task.
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
        status: denormalizeStatus(formData.status),
        projectId,
        deadline: formData.deadline ? new Date(formData.deadline).toISOString() : null,
        assignees: formData.assignees.map((id) => ({ _id: id })),
        priority: formData.priority,
        tags: formData.tags,
        source: "local",
      };

      const data = await createLocalTask(listId, payload);
      onTaskAdded(data);
      onClose();
    } catch (err) {
      console.error("❌ Error creating local task:", err.message);
      setError("⚠️ There was a problem creating the task.");
    }
  };

  /**
   * Validates form fields and triggers task creation.
   *
   * @async
   * @returns {Promise<void>} Resolves when validation passes and task is created.
   */
  const handleSubmit = async () => {
    const { title, description, assignees, deadline } = form;

    if (!title?.trim() || !description?.trim() || assignees.length === 0 || !deadline || !listId || !projectId) {
      setError("⚠️ All required fields must be completed.");
      return;
    }

    const deadlineTimestamp = new Date(deadline).getTime();
    if (isNaN(deadlineTimestamp)) {
      setError("⚠️ Invalid deadline date.");
      return;
    }

    await createTask(form);
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
          ➕ Add Local Task
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
            <MenuItem value="inprogress">🔄 In Progress</MenuItem>
            <MenuItem value="review">👀 Review</MenuItem>
            <MenuItem value="done">✅ Done</MenuItem>
          </Select>
        </FormControl>

        {/* Priority */}
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Priority</InputLabel>
          <Select
            value={form.priority}
            label="Priority"
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
          value={form.deadline}
          onChange={(e) => handleChange("deadline", e.target.value)}
          sx={{ mb: 2 }}
          InputLabelProps={{ shrink: true }}
        />

        {/* Assignees */}
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Assignees</InputLabel>
          <Select
            multiple
            value={form.assignees}
            onChange={(e) => handleChange("assignees", e.target.value)}
            renderValue={(selected) =>
              selected
                .map((id) => {
                  const user = users.find((u) => u._id === id);
                  return user ? `👤 ${user.username}` : id;
                })
                .join(", ")
            }
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

                {/* Tags */}
        <TextField
          label="🏷️ Tags (comma separated)"
          fullWidth
          value={form.tags.join(", ")}
          onChange={(e) =>
            handleChange(
              "tags",
              e.target.value.split(",").map((tag) => tag.trim())
            )
          }
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

export default AddTaskModal;
