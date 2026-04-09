/**
 * @fileoverview DeleteTaskModal component.
 * Provides a modal dialog to confirm deletion of a task (kanban, local o personal).
 *
 * @module components/modals/DeleteTaskModal
 */

import React from "react";
import {
  Modal,
  Box,
  Typography,
  Button,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { deleteKanbanTask } from "../../services/kanbanService.js";
import { deleteLocalTask, deletePersonalTask } from "../../services/taskService.js";

const DeleteTaskModal = ({ open, onClose, task, onTaskDeleted }) => {
  if (!task) return null;

  const handleDelete = async () => {
    try {
      if (task.source === "kanban") {
        await deleteKanbanTask(task._id);
      } else if (task.source === "local") {
        await deleteLocalTask(task.listId, task._id);
      } else if (task.source === "personal") {
        await deletePersonalTask(task._id);
      }

      onTaskDeleted(task);
      onClose();
    } catch (err) {
      console.error("❌ Error deleting task:", err);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          width: 400,
          bgcolor: "background.paper",
          p: 4,
          mx: "auto",
          mt: "10%",
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

        {/* Modal title */}
        <Typography variant="h6" gutterBottom>
          🗑️ Delete Task?
        </Typography>

        {/* Confirmation message */}
        <Typography sx={{ mb: 2 }}>
          ⚠️ This action cannot be undone. Do you want to delete{" "}
          <strong>{task.title}</strong>?
        </Typography>

        {/* Action buttons */}
        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
          <Button variant="outlined" onClick={onClose}>
            ❌ Cancel
          </Button>
          <Button variant="contained" color="error" onClick={handleDelete}>
            ✅ Delete
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default DeleteTaskModal;
