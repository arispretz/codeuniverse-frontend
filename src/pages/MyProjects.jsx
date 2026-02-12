/**
 * @fileoverview MyProjects component.
 * Displays a dashboard of projects with filtering, view options, progress indicators,
 * and navigation to Kanban and local tasks.
 *
 * @module pages/MyProjects
 */

import React, { useState, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase/auth.js";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  AvatarGroup,
  Avatar,
  LinearProgress,
  Box,
} from "@mui/material";

import { getCurrentUser } from "../services/userService.js";
import { getProjects } from "../services/projectService.js";

/**
 * Validate environment variable for backend URL.
 * Throws an error if not defined.
 */
const BASE_URL = import.meta.env.VITE_EXPRESS_URL;
if (!BASE_URL) {
  throw new Error("❌ Environment variable VITE_EXPRESS_URL must be defined.");
}

/**
 * MyProjects component.
 * Renders a list/grid of projects with filters, pagination, and role-based actions.
 *
 * @function MyProjects
 * @returns {JSX.Element} Projects dashboard layout
 */
const MyProjects = () => {
  const [filter, setFilter] = useState("");
  const [view, setView] = useState("grid");
  const [projects, setProjects] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [user, loading] = useAuthState(auth);
  const [userRole, setUserRole] = useState(null);
  const navigate = useNavigate();

  const handleFilterChange = (e) => setFilter(e.target.value);
  const handleViewChange = (e) => setView(e.target.value);

  // Fetch user role
  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const data = await getCurrentUser();
        setUserRole(data.role);
      } catch {
        setUserRole("developer");
      }
    };
    if (user) fetchUserRole();
  }, [user]);

  // Fetch projects with pagination
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await getProjects({ page: 1, limit: 6 });
        setProjects(data.projects || []);
        // setTotalPages(data.totalPages || 1);
      } catch {
        setProjects([]);
      }
    };
    if (user) fetchProjects();
  }, [user, filter, page]);

  if (loading) return <Typography>Loading user...</Typography>;

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h4" fontWeight="bold">💼 My Projects</Typography>
          <Typography variant="subtitle1" color="text.secondary">
            <em>All your projects. One clean dashboard.</em>
          </Typography>
        </Box>
        {userRole !== "developer" && (
          <Button variant="contained" color="primary">+ New Project</Button>
        )}
      </Box>

      {/* Filters */}
      <Grid container spacing={2} alignItems="center" mb={3}>
        <Grid item xs={12} sm={6} md={4}>
          <TextField
            label="Search project"
            fullWidth
            value={filter}
            onChange={handleFilterChange}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <FormControl fullWidth>
            <InputLabel>View</InputLabel>
            <Select value={view} onChange={handleViewChange}>
              <MenuItem value="grid">Grid</MenuItem>
              <MenuItem value="list">List</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      {/* Projects */}
      <Grid container spacing={3}>
        {projects.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            You have no assigned projects
          </Typography>
        ) : (
          projects.map((project) => (
            <Grid
              key={project._id}
              item
              xs={12}
              sm={view === "list" ? 12 : 6}
              md={view === "list" ? 12 : 4}
            >
              <Card>
                <CardContent>
                  <Typography variant="h6">{project.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {project.description}
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={project.progress || 0}
                    sx={{ mt: 1 }}
                  />
                  <Typography variant="caption">
                    {Math.round(project.progress) || 0}% completed
                  </Typography>
                  <AvatarGroup max={4} sx={{ mt: 2 }}>
                    {project.members?.map((member, i) => {
                      const displayName =
                        typeof member === "object"
                          ? member.username || member.email || "?"
                          : member;
                      return <Avatar key={i}>{displayName?.[0] || "?"}</Avatar>;
                    })}
                  </AvatarGroup>
                </CardContent>
                <Box sx={{ display: "flex", gap: 1, p: 2 }}>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => navigate(`/dashboard/projects/${project._id}/kanban`)}
                  >
                    Open Kanban
                  </Button>
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => navigate(`/dashboard/projects/${project._id}/local-tasks`)}
                  >
                    View Local Tasks
                  </Button>
                </Box>
              </Card>
            </Grid>
          ))
        )}
      </Grid>

      {/* Pagination */}
      <Box display="flex" justifyContent="center" alignItems="center" mt={4} gap={2}>
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
    </Container>
  );
};

export default MyProjects;

