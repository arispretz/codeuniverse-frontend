/**
 * @fileoverview ProjectSummaryDashboard component.
 * Displays a summary of active projects with progress calculation,
 * members, and navigation options.
 *
 * @module components/ProjectSummaryDashboard
 */

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  AvatarGroup,
  Avatar,
  LinearProgress,
  Box,
  CircularProgress,
} from "@mui/material";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase/auth.js";
import { getProjects } from "../services/projectService.js";

/**
 * ProjectSummaryDashboard component.
 * Fetches projects, calculates progress, and displays them in a dashboard view.
 *
 * @function ProjectSummaryDashboard
 * @param {object} props - Component props
 * @param {string} props.role - User role
 * @param {function} props.onSelectProject - Callback when a project is selected
 * @returns {JSX.Element} Project summary dashboard layout
 */
const ProjectSummaryDashboard = ({ role, onSelectProject }) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [user] = useAuthState(auth);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        if (!user) return;
        const data = await getProjects({ page: 1, limit: 6 });
        const rawProjects = data.projects || [];

        // Calculate progress for each project
        const enriched = rawProjects.map((p) => {
          const tasks = Array.isArray(p.tasks) ? p.tasks : [];
          const total = tasks.length;
          const completed = tasks.filter((t) => t.status === "done").length;
          const progress = total > 0 ? Math.round((completed / total) * 100) : 0;
          return { ...p, progress };
        });

        setProjects(enriched);
      } catch (error) {
        console.error("❌ Error loading projects:", error.message);
        setProjects([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, [user]);

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
    <Box sx={{ py: 4 }}>
      <Typography variant="h5" gutterBottom>
        🧠 Active Projects
      </Typography>

      {projects.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          No active projects
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {projects.map((project) => (
            <Grid key={project._id} item xs={12} sm={6} md={4}>
              <Card
                variant="outlined"
                onClick={() => onSelectProject(project._id)}
                sx={{ cursor: "pointer" }}
              >
                <CardContent>
                  <Typography variant="h6">{project.name}</Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {project.description}
                  </Typography>

                  {/* Progress bar */}
                  <LinearProgress
                    variant="determinate"
                    value={project.progress}
                    sx={{ mb: 1 }}
                  />
                  <Typography variant="caption">
                    {project.progress}% completed
                  </Typography>

                  <AvatarGroup max={4} sx={{ mt: 1, mb: 2 }}>
                    {project.members?.map((member, i) => {
                      const displayName =
                        typeof member === "object" ? member.name : member;
                      return <Avatar key={i}>{displayName?.[0]}</Avatar>;
                    })}
                  </AvatarGroup>

                  <Box sx={{ display: "flex", gap: 1 }}>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectProject(project._id);
                        navigate(`/dashboard/projects/${project._id}/kanban`);
                      }}
                    >
                      Open Kanban
                    </Button>
                    <Button
                      variant="contained"
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectProject(project._id);
                        navigate(`/dashboard/projects/${project._id}/local-tasks`);
                      }}
                    >
                      View Local Tasks
                    </Button>
                    <Button
                      variant="text"
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectProject(project._id);
                        navigate(`/dashboard/projects/${project._id}`);
                      }}
                    >
                      View Tasks
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default ProjectSummaryDashboard;

