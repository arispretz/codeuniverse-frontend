/**
 * @fileoverview TaskComments component.
 * Provides a section to display recent comments for a task and allows users to add new ones.
 * Integrates with the Kanban service (`addKanbanComment`) to persist comments.
 *
 * @module components/TaskComments
 */

import React, { useState } from "react";
import { Box, Typography, TextField, Button } from "@mui/material";
import { addKanbanComment } from "../services/kanbanService.js";

/**
 * TaskComments Component
 *
 * @function TaskComments
 * @param {Object} props - Component props.
 * @param {string} props.taskId - ID of the task to associate the comment with.
 * @param {Array<Object>} [props.comments=[]] - Existing comments for the task.
 * @param {Object} [props.comments[].author] - Author of the comment.
 * @param {string} [props.comments[].author.name] - Name of the author.
 * @param {string} [props.comments[].text] - Text content of the comment.
 * @param {Function} props.onNewComment - Callback triggered when a new comment is successfully added.
 * @returns {JSX.Element} Task comments section.
 *
 * @example
 * <TaskComments
 *   taskId="task123"
 *   comments={[
 *     { author: { name: "Ariana" }, text: "Great job!" },
 *     { author: { name: "Carlos" }, text: "Needs review." }
 *   ]}
 *   onNewComment={(newComment) => console.log("Added:", newComment)}
 * />
 */
const TaskComments = ({ taskId, comments = [], onNewComment }) => {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  /**
   * Handles submission of a new comment.
   *
   * @async
   * @function handleSubmit
   * @returns {Promise<void>} Resolves when the comment is added.
   */
  const handleSubmit = async () => {
    if (!text.trim()) return;

    setLoading(true);
    try {
      const data = await addKanbanComment(taskId, text);

      if (typeof onNewComment === "function") {
        onNewComment(data);
      }
      setText("");
    } catch (error) {
      console.error("❌ Error sending comment:", error);
    } finally {
      setLoading(false);
    }
  };

  const safeComments = Array.isArray(comments) ? comments : [];

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="subtitle2" gutterBottom>
        💬 Comments
      </Typography>

      {/* Display last 3 comments */}
      {safeComments.slice(-3).map((c, i) => (
        <Typography key={i} variant="body2" sx={{ fontSize: 13 }}>
          <strong>{c?.author?.name || "User"}:</strong> {c?.text || ""}
        </Typography>
      ))}

      {/* Comment input */}
      <Box sx={{ mt: 1 }}>
        <TextField
          fullWidth
          size="small"
          placeholder="Write a comment..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={loading}
        />
        <Button
          onClick={handleSubmit}
          variant="outlined"
          sx={{ mt: 1 }}
          disabled={loading || !text.trim()}
        >
          {loading ? "Sending..." : "Comment"}
        </Button>
      </Box>
    </Box>
  );
};

export default TaskComments;
