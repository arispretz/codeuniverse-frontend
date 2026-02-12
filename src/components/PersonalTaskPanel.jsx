/**
 * @fileoverview PersonalTasksPanel component.
 * Displays personal tasks with CRUD operations (create, view, edit, delete).
 * Includes modals for viewing and editing tasks, and snackbar notifications.
 *
 * @module components/PersonalTasksPanel
 */

import React, { useEffect, useState } from "react";
import {
  Typography,
  List,
  ListItem,
  ListItemText,
  Button,
  TextField,
  Box,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase/auth.js";

import {
  getPersonalTasks,
  createPersonalTask,
  updatePersonalTask,
  deletePersonalTask,
} from "../services/tasksService.js";

/**
 * PersonalTasksPanel component.
 * Renders a list of personal tasks with options to create, view, edit, and delete.
 *
 * @function PersonalTasksPanel
 * @returns {JSX.Element} Personal tasks panel layout
 */
const PersonalTaskPanel = () => {
  const [tasks, setTasks] = useState([]);
  const [form, setForm] = useState({ title: "", description: "" });
  const [selectedTask, setSelectedTask] = useState(null);
  const [openView, setOpenView] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);

  const [user] = useAuthState(auth);

  // Snackbar
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const showSnackbar = (message, severity = "success") => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  /**
   * Fetch personal tasks from the backend.
   */
  const fetchTasks = async () => {
    try {
      const data = await getPersonalTasks();
      setTasks(Array.isArray(data) ? data : data.items || []);
    } catch {
      showSnackbar("Error fetching personal tasks", "error");
    }
  };

  useEffect(() => {
    if (user) fetchTasks();
  }, [user]);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  /**
   * Create a new personal task.
   */
  const handleSubmit = async () => {
    if (!form.title.trim()) return;
    try {
      const newTask = await createPersonalTask(form);
      setTasks((prev) => [...prev, newTask]);
      setForm({ title: "", description: "" });
      showSnackbar("Task created successfully ✅", "success");
    } catch {
      showSnackbar("Error creating personal task", "error");
    }
  };

  /**
   * Delete a personal task.
   * @param {string} id - Task ID
   */
  const handleDelete = async (id) => {
    try {
      await deletePersonalTask(id);
      setTasks((prev) => prev.filter((t) => t._id !== id));
      showSnackbar("Task deleted ✅", "success");
    } catch {
      showSnackbar("Error deleting personal task", "error");
    }
  };

  const handleView = (task) => {
    setSelectedTask(task);
    setOpenView(true);
  };

  const handleEdit = (task) => {
    setSelectedTask(task);
    setForm({ title: task.title, description: task.description });
    setOpenEdit(true);
  };

  /**
   * Update a personal task.
   */
  const handleUpdate = async () => {
    try {
      const updatedTask = await updatePersonalTask(selectedTask._id, form);
      setTasks((prev) =>
        prev.map((t) => (t._id === selectedTask._id ? updatedTask : t))
      );
      setOpenEdit(false);
      setSelectedTask(null);
      setForm({ title: "", description: "" });
      showSnackbar("Task updated successfully ✅", "success");
    } catch {
      showSnackbar("Error updating personal task", "error");
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6">🧍 Personal Tasks</Typography>
      <TextField
        label="Title"
        fullWidth
        value={form.title}
        onChange={(e) => handleChange("title", e.target.value)}
        sx={{ mb: 1 }}
      />
      <TextField
        label="Description"
        fullWidth
        multiline
        rows={2}
        value={form.description}
        onChange={(e) => handleChange("description", e.target.value)}
        sx={{ mb: 2 }}
      />
      <Button variant="contained" onClick={handleSubmit}>
        ➕ Create Task
      </Button>

      <List sx={{ mt: 2 }}>
        {tasks.map((task) => (
          <ListItem
            key={task._id}
            secondaryAction={
              <>
                <IconButton edge="end" onClick={() => handleView(task)}>
                  <VisibilityIcon />
                </IconButton>
                <IconButton edge="end" onClick={() => handleEdit(task)}>
                  <EditIcon />
                </IconButton>
                <IconButton edge="end" onClick={() => handleDelete(task._id)}>
                  <DeleteIcon />
                </IconButton>
              </>
            }
          >
            <ListItemText primary={task.title} secondary={task.description} />
          </ListItem>
        ))}
      </List>

      {/* View Modal */}
      <Dialog open={openView} onClose={() => setOpenView(false)}>
        <DialogTitle>Task Details</DialogTitle>
        <DialogContent>
          <Typography variant="subtitle1">{selectedTask?.title}</Typography>
          <Typography variant="body2">{selectedTask?.description}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenView(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={openEdit} onClose={() => setOpenEdit(false)}>
        <DialogTitle>Edit Task</DialogTitle>
        <DialogContent>
          <TextField
            label="Title"
            fullWidth
            value={form.title}
            onChange={(e) => handleChange("title", e.target.value)}
            sx={{ mb: 1 }}
          />
          <TextField
            label="Description"
            fullWidth
            multiline
            rows={2}
            value={form.description}
            onChange={(e) => handleChange("description", e.target.value)}
            sx={{ mb: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEdit(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleUpdate}>
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default PersonalTaskPanel;
