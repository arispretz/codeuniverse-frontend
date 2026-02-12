/**
 * @fileoverview TaskDetailModal component.
 * Provides a modal dialog to display detailed information about a Kanban task,
 * including metadata, tags, comments, and change history.
 * Allows users to add new comments to the task.
 *
 * @module components/modals/TaskDetailModal
 */

import React, { useState, useEffect } from "react";
import {
  Modal,
  Box,
  Typography,
  Chip,
  Avatar,
  Divider,
  TextField,
  Button,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { format } from "date-fns";
import { addKanbanComment } from "../../services/kanbanService.js";

/**
 * TaskDetailModal Component
 *
 * @function TaskDetailModal
 * @param {Object} props - Component props.
 * @param {boolean} props.open - Controls whether the modal is open.
 * @param {Function} props.onClose - Callback to close the modal.
 * @param {Object} props.task - Task object containing details to display.
 * @param {string} props.task._id - Unique identifier of the task.
 * @param {string} props.task.title - Task title.
 * @param {string} [props.task.description] - Task description.
 * @param {string} props.task.status - Task status (e.g., "todo", "inprogress", "review", "done").
 * @param {string} props.task.priority - Task priority ("high", "medium", "low").
 * @param {string} [props.task.deadline] - Task deadline (ISO date string).
 * @param {string} [props.task.assignedTo] - ID of the assigned user.
 * @param {Array<string>} [props.task.tags] - Optional tags associated with the task.
 * @param {Array<Object>} [props.task.comments] - List of comments for the task.
 * @param {Array<Object>} [props.task.history] - Change history of the task.
 * @param {Object} props.avatars - Map of user IDs to avatar URLs.
 * @param {Function} props.onCommentAdded - Callback triggered when a new comment is successfully added.
 * @returns {JSX.Element|null} Modal dialog component, or `null` if no task is provided.
 *
 * @example
 * <TaskDetailModal
 *   open={isOpen}
 *   onClose={handleClose}
 *   task={selectedTask}
 *   avatars={{ userId123: "https://example.com/avatar.png" }}
 *   onCommentAdded={(comment) => console.log("New comment:", comment)}
 * />
 */
const TaskDetailModal = ({ open, onClose, task, avatars, onCommentAdded }) => {
  const [newComment, setNewComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setNewComment("");
    setSubmitting(false);
  }, [task]);

  if (!task) return null;

  const deadlineFormatted = task.deadline
    ? format(new Date(task.deadline), "dd/MM/yyyy")
    : "No deadline";

  /**
   * Handles adding a new comment to the task.
   *
   * @async
   * @function handleAddComment
   * @returns {Promise<void>} Resolves when the comment is successfully added.
   */
  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    setSubmitting(true);
    try {
      const data = await addKanbanComment(task._id, newComment);
      onCommentAdded(data);
      setNewComment("");
    } catch (err) {
      console.error("❌ Error adding comment:", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      {/* Modal content */}
      <Box
        sx={{
          width: 500,
          maxHeight: "80vh",
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

        {/* Task details */}
        <Box sx={{ flex: 1, overflowY: "auto", pr: 1 }}>
          <Typography variant="h6" gutterBottom>
            📝 {task.title}
          </Typography>
          <Typography variant="body2" sx={{ mb: 2 }}>
            {task.description || "📄 No description"}
          </Typography>

          {/* Metadata chips */}
          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 2 }}>
            <Chip label={`📌 Status: ${task.status}`} color="info" />
            <Chip label={`⚡ Priority: ${task.priority}`} color="warning" />
            <Chip label={`🌐 Source: Local`} color="default" />
            <Chip label={`📅 Deadline: ${deadlineFormatted}`} />
            {task.assignedTo && (
              <Chip
                avatar={
                  avatars?.[task.assignedTo] ? (
                    <Avatar src={avatars[task.assignedTo]} />
                  ) : (
                    <Avatar>{task.assignedTo[0]}</Avatar>
                  )
                }
                label={`👤 Assigned: ${task.assignedTo}`}
              />
            )}
          </Box>

          {/* Tags */}
          {task.tags?.length > 0 && (
            <>
              <Typography variant="subtitle2">🏷️ Tags:</Typography>
              <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 2 }}>
                {task.tags.map((tag, i) => (
                  <Chip key={i} label={tag} variant="outlined" />
                ))}
              </Box>
            </>
          )}

          {/* Comments */}
          {task.comments?.length > 0 && (
            <>
              <Divider sx={{ my: 2 }} />
              <Typography variant="subtitle2">💬 Comments:</Typography>
              {task.comments.map((c, i) => (
                <Box key={i} sx={{ mb: 1 }}>
                  <Typography variant="body2">
                    <strong>{c.author?.name || "User"}:</strong> {c.text}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {format(new Date(c.createdAt), "dd/MM/yyyy HH:mm")}
                  </Typography>
                </Box>
              ))}
            </>
          )}

          {/* History */}
          {task.history?.length > 0 && (
            <>
              <Divider sx={{ my: 2 }} />
              <Typography variant="subtitle2">📜 Change History:</Typography>
              {task.history.map((h, i) => (
                <Box key={i} sx={{ mb: 1 }}>
                  <Typography variant="body2">
                    <strong>{h.changedBy?.name || "User"}:</strong> {h.change}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {format(new Date(h.changedAt), "dd/MM/yyyy HH:mm")}
                  </Typography>
                </Box>
              ))}
            </>
          )}

          {/* Add comment field */}
          <Divider sx={{ my: 2 }} />
          <Typography variant="subtitle2">➕ Add Comment:</Typography>
          <TextField
            fullWidth
            multiline
            rows={2}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write your comment..."
            sx={{ mb: 2 }}
          />
        </Box>

        {/* Action buttons */}
        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
          <Button
            variant="contained"
            onClick={handleAddComment}
            disabled={submitting}
          >
            💬 Comment
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default TaskDetailModal;
