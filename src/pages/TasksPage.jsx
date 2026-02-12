/**
 * @fileoverview TasksPage component.
 * Displays tasks for a specific project or list, with dynamic rendering
 * for local and Kanban boards. Includes snackbar feedback for errors.
 *
 * @module pages/TasksPage
 */

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Container,
  Typography,
  CircularProgress,
  Box,
  Snackbar,
  Alert,
} from "@mui/material";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase/auth.js";

import LocalTaskBoard from "./LocalTaskBoard.jsx";
import KanbanBoard from "./KanbanBoard.jsx";
import { getProjectFullById } from "../services/projectService.js";

const TasksPage = () => {
  const { id, listId } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user] = useAuthState(auth);

  // Snackbar state
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const showSnackbar = (msg, sev = "success") => {
    setSnackbarMessage(msg);
    setSnackbarSeverity(sev);
    setSnackbarOpen(true);
  };

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const token = await user.getIdToken();
        const data = await getProjectFullById(id, token);
        setProject(data);
      } catch (err) {
        console.error("❌ Error fetching project:", err);
        showSnackbar("Error fetching project", "error");
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchProject();
  }, [id, user]);

  if (loading) {
    return (
      <Box sx={{ py: 6, textAlign: "center" }}>
        <CircularProgress />
        <Typography variant="body2" sx={{ mt: 2 }}>
          Loading tasks...
        </Typography>
      </Box>
    );
  }

  if (!project) {
    return (
      <Typography variant="body2" color="error">
        Project not found
      </Typography>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        📋 {listId ? `Tasks from list ${listId}` : "Project Tasks"}
      </Typography>

      {!listId && (
        <>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            {project.description}
          </Typography>

          {/* Local Lists */}
          <Typography variant="h6">📋 Local Lists</Typography>
          <LocalTaskBoard projectId={project._id} />

          {/* Kanban Lists */}
          <Typography variant="h6" sx={{ mt: 3 }}>
            🧱 Kanban Lists
          </Typography>
          <KanbanBoard projectId={project._id} />
        </>
      )}

      {listId && (
        <>
          {/** Si quieres que al entrar con listId se renderice directamente el board correspondiente */}
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Showing tasks from list {listId}
          </Typography>
          {/* Aquí puedes decidir si tu board necesita listId o projectId */}
          <LocalTaskBoard projectId={project._id} listId={listId} />
          <KanbanBoard projectId={project._id} listId={listId} />
        </>
      )}

      {/* Snackbar Feedback */}
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
    </Container>
  );
};

export default TasksPage;
