/**
 * @fileoverview KanbanTaskPreview component.
 * Displays a preview list of Kanban tasks assigned to the current user.
 * Includes a modal for viewing task details.
 *
 * @module components/KanbanTaskPreview
 */

import React, { useEffect, useState } from "react";
import {
  Typography,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { getKanbanTasks } from "../services/kanbanService.js";

/**
 * KanbanTaskPreview component.
 * Fetches and displays a limited number of Kanban tasks assigned to the user.
 *
 * @function KanbanTaskPreview
 * @param {object} props - Component props
 * @param {number} [props.previewCount=3] - Number of tasks to preview
 * @param {string} props.selectedProjectId - ID of the selected project
 * @param {string} props.userMongoId - MongoDB user ID
 * @param {string} props.firebaseUid - Firebase user UID
 * @returns {JSX.Element} Kanban task preview layout
 */
const KanbanTaskPreview = ({
  previewCount = 3,
  selectedProjectId,
  userMongoId,
  firebaseUid,
}) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openView, setOpenView] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  useEffect(() => {
    const fetchTasks = async () => {
      if (!selectedProjectId || (!userMongoId && !firebaseUid)) return;
      try {
        setLoading(true);

        const data = await getKanbanTasks({ projectId: selectedProjectId });
        const arr = Array.isArray(data) ? data : data.items || [];

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
  }, [selectedProjectId, userMongoId, firebaseUid, previewCount]);

  /**
   * Opens the task detail modal.
   * @param {object} task - Task object
   */
  const handleView = (task) => {
    setSelectedTask(task);
    setOpenView(true);
  };

  if (loading) {
    return <CircularProgress size={24} sx={{ mt: 2 }} />;
  }

  if (tasks.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
        You have no assigned Kanban tasks.
      </Typography>
    );
  }

  return (
    <>
      <List dense>
        {tasks.map((task) => (
          <ListItem
            key={task._id}
            secondaryAction={
              <Box>
                <IconButton
                  edge="end"
                  color="primary"
                  onClick={() => handleView(task)}
                >
                  <VisibilityIcon />
                </IconButton>
              </Box>
            }
          >
            <ListItemText
              primary={task.title}
              secondary={`Status: ${task.status}`}
            />
          </ListItem>
        ))}
      </List>

      {/* Task detail modal */}
      <Dialog open={openView} onClose={() => setOpenView(false)}>
        <DialogTitle>Kanban Task Details</DialogTitle>
        <DialogContent>
          <Typography variant="subtitle1">{selectedTask?.title}</Typography>
          <Typography variant="body2">{selectedTask?.description}</Typography>
          <Typography variant="body2">Status: {selectedTask?.status}</Typography>
          <Typography variant="body2">
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

export default KanbanTaskPreview;
