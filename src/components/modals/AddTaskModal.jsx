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
        // ✅ Normalizamos siempre al _id de Mongo
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

        {/* ... resto del formulario igual ... */}

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

        {/* ... resto igual ... */}
      </Box>
    </Modal>
  );
};

export default AddTaskModal;
