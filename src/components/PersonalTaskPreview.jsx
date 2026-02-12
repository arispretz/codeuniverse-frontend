/**
 * @fileoverview PersonalTaskPreview component.
 * Displays a preview list of personal tasks assigned to the current user.
 * Shows a limited number of tasks and allows viewing details.
 *
 * @module components/PersonalTaskPreview
 */

import React, { useEffect, useState } from "react";
import {
  List,
  ListItem,
  ListItemText,
  IconButton,
  Typography,
  CircularProgress,
  Box,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase/auth.js";
import { getPersonalTasks } from "../services/taskService.js";

/**
 * PersonalTaskPreview component.
 * Fetches and displays a limited number of personal tasks with a view option.
 *
 * @function PersonalTaskPreview
 * @param {object} props - Component props
 * @param {number} [props.previewCount=3] - Number of tasks to preview
 * @param {function} props.onView - Callback when a task is selected for viewing
 * @returns {JSX.Element} Personal task preview layout
 */
const PersonalTaskPreview = ({ previewCount = 3, onView }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [user] = useAuthState(auth);

  useEffect(() => {
    const fetchTasks = async () => {
      if (!user) return;
      try {
        setLoading(true);
        const tasksArray = await getPersonalTasks();
        setTasks(Array.isArray(tasksArray) ? tasksArray : tasksArray.items || []);
      } catch {
        setTasks([]);
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, [user]);

  if (loading) {
    return (
      <Box sx={{ textAlign: "center", py: 2 }}>
        <CircularProgress size={24} />
        <Typography variant="body2" sx={{ mt: 1 }}>
          Loading personal tasks...
        </Typography>
      </Box>
    );
  }

  if (!tasks.length) {
    return (
      <Typography variant="body2" color="text.secondary">
        You have no personal tasks assigned.
      </Typography>
    );
  }

  return (
    <List>
      {tasks.slice(0, previewCount).map((task) => (
        <ListItem key={task._id}>
          <ListItemText primary={task.title} secondary={task.description} />
          <IconButton edge="end" onClick={() => onView?.(task)}>
            <VisibilityIcon />
          </IconButton>
        </ListItem>
      ))}
    </List>
  );
};

export default PersonalTaskPreview;
