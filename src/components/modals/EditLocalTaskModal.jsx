/**
 * @fileoverview EditLocalTaskModal component.
 * Provides a modal dialog to edit a local task. Includes form fields for editing
 * and a preview panel to visualize changes before saving.
 *
 * @module components/modals/EditLocalTaskModal
 */

import React from "react";
import {
  Modal,
  Box,
  TextField,
  Button,
  Typography,
  Chip,
  Select,
  MenuItem,
  Paper,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { DatePicker } from "@mui/x-date-pickers";
import { denormalizeStatus } from "../KanbanUtils.jsx";

const EditLocalTaskModal = ({ open, onClose, form, setForm, handleUpdate }) => {
  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    if (!form.title?.trim() || !form.description?.trim()) {
      console.error("⚠️ Title and description are required.");
      return;
    }

    const payload = {
      ...form,
      status: denormalizeStatus(form.status),
      deadline: form.deadline ? new Date(form.deadline).toISOString() : null,
      assignedTo: form.assignedTo?._id || form.assignedTo || null,
      assignees: (form.assignees || []).map((id) =>
        typeof id === "object" && id._id ? id._id : id
      ),
      source: "local",
    };

    handleUpdate(payload);
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          width: 600,
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
          ✏️ Edit Local Task
        </Typography>

        <Box sx={{ display: "flex", gap: 3 }}>
          <Box sx={{ flex: 1 }}>
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
              rows={4}
              required
              value={form.description}
              onChange={(e) => handleChange("description", e.target.value)}
              sx={{ mb: 2 }}
            />

            <Typography variant="subtitle2">⚡ Priority</Typography>
            <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
              {["high", "medium", "low"].map((p) => (
                <Chip
                  key={p}
                  label={p.toUpperCase()}
                  color={form.priority === p ? "primary" : "default"}
                  onClick={() => handleChange("priority", p)}
                />
              ))}
            </Box>

            <Typography variant="subtitle2">📌 Status</Typography>
            <Select
              fullWidth
              value={form.status}
              onChange={(e) => handleChange("status", e.target.value)}
              sx={{ mb: 2 }}
            >
              <MenuItem value="todo">📝 To Do</MenuItem>
              <MenuItem value="inprogress">🔄 In Progress</MenuItem>
              <MenuItem value="review">👀 Review</MenuItem>
              <MenuItem value="done">✅ Done</MenuItem>
            </Select>

            <Typography variant="subtitle2">📅 Deadline</Typography>
            <DatePicker
              value={form.deadline ? new Date(form.deadline) : null}
              onChange={(newDate) => handleChange("deadline", newDate)}
              slotProps={{ textField: { fullWidth: true } }}
            />
          </Box>

          <Paper sx={{ flex: 1, p: 2, bgcolor: "background.paper" }}>
            <Typography variant="h6">
              {form.title || "📝 Untitled"}
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              {form.description || "📄 No description"}
            </Typography>
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

        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1, mt: 3 }}>
          <Button onClick={onClose} aria-label="Cancel">
            ❌ Cancel
          </Button>
          <Button variant="contained" onClick={handleSave} aria-label="Save changes">
            ✅ Save Changes
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default EditLocalTaskModal;
