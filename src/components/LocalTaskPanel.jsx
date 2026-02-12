/**
 * @fileoverview LocalTaskPanel component.
 * Displays a preview of local tasks assigned to the current user.
 * Includes a modal for viewing task details.
 *
 * @module components/LocalTaskPanel
 */

import React, { useEffect, useState } from "react";
import {
  Typography,
  CircularProgress,
  Box,
  Card,
  CardContent,
  Chip,
  Grid,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { getLocalTasks } from "../services/taskService.js";

/**
 * LocalTaskPanel component.
 * Fetches and displays a limited number of local tasks assigned to the user.
 *
 * @function LocalTaskPanel
 * @param {object} props - Component props
 * @param {number} [props.previewCount=3] - Number of tasks to preview
 * @param {string} props.userMongoId - MongoDB user ID
 * @param {string} props.firebaseUid - Firebase user UID
 * @param {string} props.projectId - Project ID
 * @returns {JSX.Element} Local task preview layout
 */
const LocalTaskPanel = ({ previewCount = 3, userMongoId, firebaseUid, projectId }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);

  const [openView, setOpenView] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  useEffect(() => {
    if (!projectId || (!userMongoId && !firebaseUid)) return;
    const fetchTasks = async () => {
      try {
        setLoading(true);
        const data = await getLocalTasks(projectId);
        const arr = Array.isArray(data) ? data : data.items || [];

        // Filter tasks assigned to the current user (Mongo _id or Firebase UID)
        const filtered = arr.filter(
          (t) =>
            t.assignedTo === userMongoId ||
            t.assignedTo === firebaseUid ||
            (t.assignees || []).some(
              (a) => a._id === userMongoId || a.uid === firebaseUid
            )
        );

        setTasks(filtered.slice(0, previewCount));
      } catch {
        setTasks([]);
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, [projectId, userMongoId, firebaseUid, previewCount]);

  const handleView = (task) => {
    setSelectedTask(task);
    setOpenView(true);
  };

  if (loading) {
    return (
      <Box sx={{ textAlign: "center", py: 2 }}>
        <CircularProgress size={24} />
        <Typography variant="body2" sx={{ mt: 1 }}>
          Loading your local tasks...
        </Typography>
      </Box>
    );
  }

  if (!tasks.length) {
    return (
      <Typography variant="body2" color="text.secondary">
        You have no assigned local tasks.
      </Typography>
    );
  }

  return (
    <>
      <Grid container spacing={2}>
        {tasks.map((task) => (
          <Grid key={task._id} item xs={12} sm={6} md={4}>
            <Card variant="outlined" sx={{ borderRadius: 2, boxShadow: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {task.title}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 2 }}
                >
                  {task.description}
                </Typography>

                <Chip label={`Status: ${task.status}`} sx={{ mr: 1 }} />
                <Chip
                  label={`Priority: ${task.priority || "N/A"}`}
                  sx={{ mr: 1 }}
                />

                <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                  📅 Deadline:{" "}
                  {task.deadline
                    ? new Date(task.deadline).toLocaleDateString()
                    : "N/A"}
                </Typography>

                {/* Action icon: view only in panel */}
                <Box sx={{ mt: 1 }}>
                  <IconButton onClick={() => handleView(task)}>
                    <VisibilityIcon />
                  </IconButton>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Task detail modal */}
      <Dialog open={openView} onClose={() => setOpenView(false)}>
        <DialogTitle>Task Details</DialogTitle>
        <DialogContent>
          <Typography variant="subtitle1">{selectedTask?.title}</Typography>
          <Typography variant="body2">{selectedTask?.description}</Typography>
          <Typography variant="caption" display="block" sx={{ mt: 1 }}>
            Status: {selectedTask?.status}
          </Typography>
          <Typography variant="caption" display="block">
            Priority: {selectedTask?.priority}
          </Typography>
          <Typography variant="caption" display="block">
            Deadline:{" "}
            {selectedTask?.deadline
              ? new Date(selectedTask.deadline).toLocaleDateString()
              : "N/A"}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenView(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default LocalTaskPanel;
