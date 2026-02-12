/**
 * @fileoverview ProjectSelector component.
 * Allows the user to select a project from the list and open its editor.
 *
 * @module components/ProjectSelector
 */

import React, { useEffect, useState } from "react";
import { Box, Typography, Button, CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { getProjects } from "../services/projectService.js";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase/auth.js";

/**
 * ProjectSelector component.
 * Fetches projects and allows navigation to the project editor.
 *
 * @function ProjectSelector
 * @returns {JSX.Element} Project selector layout
 */
const ProjectSelector = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [user] = useAuthState(auth);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        if (!user) return;
        const data = await getProjects({ page: 1, limit: 6 });
        setProjects(data.projects || []);
      } catch (err) {
        console.error("❌ Error loading projects:", err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, [user]);

  if (loading) {
    return (
      <Box sx={{ textAlign: "center", py: 4 }}>
        <CircularProgress />
        <Typography variant="body2" sx={{ mt: 2 }}>
          Loading projects...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h5" gutterBottom>
        📂 Select a project to open the editor
      </Typography>
      {projects.map((project) => (
        <Button
          key={project._id}
          variant="outlined"
          sx={{ m: 1 }}
          onClick={() => navigate(`/dashboard/projects/${project._id}/editor`)}
        >
          {project.name}
        </Button>
      ))}
    </Box>
  );
};

export default ProjectSelector;
