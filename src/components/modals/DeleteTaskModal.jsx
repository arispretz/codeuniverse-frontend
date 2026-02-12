/**
 * @fileoverview DeleteTaskModal component.
 * Provides a modal dialog to confirm deletion of a Kanban task.
 * Calls the backend service to delete the task and triggers a callback on success.
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

/**
 * DeleteTaskModal Component
 *
 * @function DeleteTaskModal
 * @param {Object} props - Component props.
 * @param {boolean} props.open - Controls whether the modal is open.
 * @param {Function} props.onClose - Callback to close the modal.
 * @param {Object} props.task - Task object to be deleted. Must include `_id` and `title`.
 * @param {Function} props.onTaskDeleted - Callback triggered when a task is successfully deleted.
 * @returns {JSX.Element|null} Modal dialog for task deletion, or `null` if no task is provided.
 */
const DeleteTaskModal = ({ open, onClose, task, onTaskDeleted }) => {
  if (!task) return null;

  /**
   * Handles task deletion by calling the backend service.
   *
   * @async
   * @function handleDelete
   * @returns {Promise<void>} Resolves when the task is deleted successfully.
   */
  const handleDelete = async () => {
    try {
      await deleteKanbanTask(task._id);
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
