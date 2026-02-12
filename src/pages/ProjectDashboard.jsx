/**
 * @fileoverview ProjectDashboard component.
 * Displays a dashboard of projects with progress indicators, navigation buttons,
 * local and Kanban lists, pagination, and project detail modal.
 *
 * @module pages/ProjectDashboard
 */

import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  LinearProgress,
  Button,
  CircularProgress,
  Box,
  Divider,
  Snackbar,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase/auth.js";
import ProjectDetailModal from "../components/modals/ProjectDetailModal";

import { getProjects } from "../services/projectService.js";

/**
 * ProjectDashboard component.
 * Renders a list of projects with details, progress, and navigation options.
 *
 * @function ProjectDashboard
 * @returns {JSX.Element} Project dashboard layout
 */
const ProjectDashboard = () => {
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [user] = useAuthState(auth);
  const navigate = useNavigate();

  // Snackbar feedback
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const showSnackbar = (msg, sev = "success") => {
    setSnackbarMessage(msg);
    setSnackbarSeverity(sev);
    setSnackbarOpen(true);
  };

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        if (!user) return;
        const data = await getProjects({ page, limit: 6 });
        setProjects(data.projects || []);
        setTotalPages(data.totalPages || 1);
      } catch {
        setProjects([]);
        showSnackbar("Error loading projects", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [user, page]);

  if (loading) {
    return (
      <Box sx={{ py: 6, textAlign: "center" }}>
        <CircularProgress />
        <Typography variant="body2" sx={{ mt: 2 }}>
          Loading projects...
        </Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        📂 Project Dashboard
      </Typography>

      {projects.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          No active projects
        </Typography>
      ) : (
        <>
          <Grid container spacing={3}>
            {projects.map((project) => (
              <Grid key={project._id} item xs={12} sm={6} md={4}>
                <Card>
                  <CardContent>
                    <Typography variant="h6">{project.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {project.description}
                    </Typography>
                    <Chip
                      label={`Progress: ${Math.round(project.progress) || 0}%`}
                      sx={{ mt: 1 }}
                    />
                    <LinearProgress
                      variant="determinate"
                      value={project.progress || 0}
                      sx={{ mt: 1 }}
                    />

                    {/* Navigation buttons */}
                    <Box sx={{ mt: 2, display: "flex", gap: 1, flexWrap: "wrap" }}>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => {
                          setSelectedProjectId(project._id);
                          setOpenModal(true);
                        }}
                      >
                        View Details
                      </Button>

                      <Button
                        variant="contained"
                        size="small"
                        onClick={() =>
                          navigate(`/dashboard/projects/${project._id}/kanban`)
                        }
                      >
                        Open Kanban
                      </Button>

                      <Button
                        variant="contained"
                        size="small"
                        onClick={() =>
                          navigate(`/dashboard/projects/${project._id}/local-tasks`)
                        }
                      >
                        View Local Tasks
                      </Button>
                    </Box>

                    {/* Local Lists */}
                    {project.localLists?.length > 0 && (
                      <>
                        <Divider sx={{ my: 2 }} />
                        <Typography variant="subtitle2">📋 Local Lists</Typography>
                        {project.localLists.map((list) => (
                          <Button
                            key={list._id}
                            variant="text"
                            size="small"
                            sx={{ mr: 1, mt: 1 }}
                            onClick={() =>
                              navigate(`/dashboard/projects/${project._id}/lists/${list._id}/local-tasks`)
                            }
                          >
                            {list.name}
                          </Button>
                        ))}
                      </>
                    )}

                    {/* Kanban Lists */}
                    {project.kanbanLists?.length > 0 && (
                      <>
                        <Divider sx={{ my: 2 }} />
                        <Typography variant="subtitle2">🧱 Kanban Lists</Typography>
                        {project.kanbanLists.map((list) => (
                          <Button
                            key={list._id}
                            variant="text"
                            size="small"
                            sx={{ mr: 1, mt: 1 }}
                            onClick={() =>
                              navigate(`/dashboard/projects/${project._id}/lists/${list._id}/kanban`)
                            }
                          >
                            {list.name}
                          </Button>
                        ))}
                      </>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Pagination */}
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            mt={4}
            gap={2}
          >
            <Button
              variant="outlined"
              disabled={page <= 1}
              onClick={() => setPage((prev) => prev - 1)}
            >
              ⬅️ Previous
            </Button>
            <Typography variant="body2">
              Page {page} of {totalPages}
            </Typography>
            <Button
              variant="outlined"
              disabled={page >= totalPages}
              onClick={() => setPage((prev) => prev + 1)}
            >
              Next ➡️
            </Button>
          </Box>
        </>
      )}

      {/* Project Detail Modal */}
      <ProjectDetailModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        projectId={selectedProjectId}
      />

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

export default ProjectDashboard;

