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
import { useSnackbar } from "notistack";
import { DatePicker } from "@mui/x-date-pickers"; 

const AddKanbanTaskModal = ({ open, onClose, onTaskAdded, listId, projectId }) => {
  const { enqueueSnackbar } = useSnackbar();
  const [form, setForm] = useState({
    title: "",
    description: "",
    status: "todo",
    assignees: [],
    priority: "medium",
    deadline: null, 
    tags: [],
  });

  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (open) {
      getPublicUsers()
        .then((data) => setUsers(data))
        .catch((err) => {
          console.error("❌ Error loading users:", err);
          enqueueSnackbar("Error loading users ❌", { variant: "error" });
          setUsers([]);
        });
    }
  }, [open, enqueueSnackbar]);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const createTask = async (formData) => {
    try {
      const payload = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        status: formData.status || "todo",
        projectId,
        deadline: formData.deadline ? formData.deadline.toISOString() : null, 
        assignees: formData.assignees,
        priority: formData.priority,
        tags: formData.tags,
        source: "kanban",
      };

      const data = await createKanbanTask(listId, payload);

      if (onTaskAdded) {
        onTaskAdded(data);
      }

      onClose();
    } catch (err) {
      console.error("❌ Error creating Kanban task:", err.message);
      enqueueSnackbar("Error creating Kanban task ❌", { variant: "error" });
    }
  };

  const handleSubmit = async () => {
    const { title, description, assignees, status, priority, deadline } = form;

    if (!title?.trim()) {
      enqueueSnackbar("⚠️ Title is required.", { variant: "warning" });
      return;
    }
    if (!description?.trim()) {
      enqueueSnackbar("⚠️ Description is required.", { variant: "warning" });
      return;
    }
    if (assignees.length === 0) {
      enqueueSnackbar("⚠️ You must assign the task to at least one user.", { variant: "warning" });
      return;
    }
    if (!listId || !projectId) {
      enqueueSnackbar("⚠️ Missing project or list information.", { variant: "warning" });
      return;
    }

    const validStatuses = ["todo", "in_progress", "review", "done"];
    if (!status || !validStatuses.includes(status)) {
      enqueueSnackbar("⚠️ Invalid task status.", { variant: "warning" });
      return;
    }

    const validPriorities = ["high", "medium", "low"];
    if (!priority || !validPriorities.includes(priority)) {
      enqueueSnackbar("⚠️ Priority must be high, medium, or low.", { variant: "warning" });
      return;
    }

    if (deadline && isNaN(deadline.getTime())) {
      enqueueSnackbar("⚠️ Invalid deadline date.", { variant: "warning" });
      return;
    }

    await createTask(form);
  };

  return (
    <Modal open={open} onClose={onClose}>
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

        <TextField
          label="📝 Title"
          fullWidth
          required
          value={form.title}
          onChange={(e) => handleChange("title", e.target.value)}
          sx={{ mb: 2 }}
        />
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

        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={form.status}
            onChange={(e) => handleChange("status", e.target.value)}
          >
            <MenuItem value="todo">📝 To Do</MenuItem>
            <MenuItem value="in_progress">🔄 In Progress</MenuItem>
            <MenuItem value="review">👀 Review</MenuItem>
            <MenuItem value="done">✅ Done</MenuItem>
          </Select>
        </FormControl>

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

        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Priority</InputLabel>
          <Select
            value={form.priority}
            onChange={(e) => handleChange("priority", e.target.value)}
          >
            <MenuItem value="high">⚡ High</MenuItem>
            <MenuItem value="medium">📊 Medium</MenuItem>
            <MenuItem value="low">🐢 Low</MenuItem>
          </Select>
        </FormControl>

        <DatePicker
          label="📅 Deadline"
          value={form.deadline}
          onChange={(newDate) => handleChange("deadline", newDate)}
          slotProps={{ textField: { fullWidth: true, sx: { mb: 2 } } }}
        />

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
