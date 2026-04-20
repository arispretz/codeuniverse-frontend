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
import { useSnackbar } from "notistack";
import { DatePicker } from "@mui/x-date-pickers"; 

const AddTaskModal = ({ open, onClose, onTaskAdded, listId, projectId }) => {
  const { enqueueSnackbar } = useSnackbar();
  const [form, setForm] = useState({
    title: "",
    description: "",
    status: "todo",
    assignees: [],
    priority: "Medium",
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
        title: formData.title,
        description: formData.description,
        status: denormalizeStatus(formData.status),
        projectId,
        deadline: formData.deadline ? formData.deadline.toISOString() : null, 
        assignees: (formData.assignees || []).map((id) =>
          typeof id === "object" && id._id ? id._id : id
        ),
        priority: formData.priority,
        tags: formData.tags,
        source: "local",
      };

      const data = await createLocalTask(listId, payload);
      onTaskAdded(data);
      onClose();
    } catch (err) {
      console.error("❌ Error creating local task:", err.message);
      enqueueSnackbar("Error creating local task ❌", { variant: "error" });
    }
  };

  const handleSubmit = async () => {
    const { title, description, assignees, deadline } = form;

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
    if (!deadline) {
      enqueueSnackbar("⚠️ Deadline is required.", { variant: "warning" });
      return;
    }
    if (!listId || !projectId) {
      enqueueSnackbar("⚠️ Missing project or list information.", { variant: "warning" });
      return;
    }
    if (isNaN(deadline.getTime())) {
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
          ➕ Add Local Task
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
            label="Status"
            onChange={(e) => handleChange("status", e.target.value)}
          >
            <MenuItem value="todo">📝 To Do</MenuItem>
            <MenuItem value="inprogress">🔄 In Progress</MenuItem>
            <MenuItem value="review">👀 Review</MenuItem>
            <MenuItem value="done">✅ Done</MenuItem>
          </Select>
        </FormControl>

        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Priority</InputLabel>
          <Select
            value={form.priority}
            label="Priority"
            onChange={(e) => handleChange("priority", e.target.value)}
          >
            <MenuItem value="High">⚡ High</MenuItem>
            <MenuItem value="Medium">📊 Medium</MenuItem>
            <MenuItem value="Low">🐢 Low</MenuItem>
          </Select>
        </FormControl>

        <DatePicker
          label="📅 Deadline"
          value={form.deadline}
          onChange={(newDate) => handleChange("deadline", newDate)}
          slotProps={{ textField: { fullWidth: true, sx: { mb: 2 } } }}
        />

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
