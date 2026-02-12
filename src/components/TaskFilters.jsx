/**
 * @fileoverview TaskFilters component.
 * Provides filtering options for tasks in the Kanban board, including:
 * - Project selection
 * - List selection
 * - Assigned user filter
 * - Priority filter
 * - Sorting options (by deadline or priority, ascending/descending)
 * - Refresh button to reload tasks
 * - Last sync timestamp
 *
 * Compatible with MUI Grid v7 (stable).
 *
 * @module components/TaskFilters
 */

import React from "react";
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Typography,
  Grid,
} from "@mui/material";

/**
 * TaskFilters Component
 *
 * @function TaskFilters
 * @param {Object} props - Component props.
 * @returns {JSX.Element} Task filters panel.
 */
const TaskFilters = ({
  lists = [],
  selectedListId,
  setSelectedListId,
  projects = [],
  activeProjectId,
  setActiveProjectId,
  priorityFilter,
  setPriorityFilter,
  userOptions = [],
  selectedUser,
  setSelectedUser,
  fetchTasks,
  loading,
  lastSync,
  sortBy,
  setSortBy,
  sortOrder,
  setSortOrder,
}) => {
  return (
    <Box sx={{ mb: 3 }}>
      <Grid container spacing={2}>
        {/* Project filter */}
        <Grid item xs={12} sm={6} md={3}>
          <FormControl fullWidth>
            <InputLabel>Project</InputLabel>
            <Select
              value={activeProjectId ?? ""}
              onChange={(e) => setActiveProjectId(e.target.value)}
            >
              {projects.map((p) => (
                <MenuItem key={p._id} value={String(p._id)}>
                  {p.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* List filter */}
        <Grid item xs={12} sm={6} md={3}>
          <FormControl fullWidth>
            <InputLabel>List</InputLabel>
            <Select
              value={selectedListId ?? ""}
              onChange={(e) => setSelectedListId(e.target.value)}
            >
              <MenuItem value="">All lists</MenuItem>
              {lists.map((list) => (
                <MenuItem key={list._id} value={String(list._id)}>
                  {list.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* User filter */}
        <Grid item xs={12} sm={6} md={3}>
          <FormControl fullWidth>
            <InputLabel>User</InputLabel>
            <Select
              value={selectedUser ?? ""}
              onChange={(e) => {
                const val = e.target.value;
                setSelectedUser(val === "" ? null : val);
              }}
            >
              <MenuItem value="">All</MenuItem>
              {userOptions.map((u) => (
                <MenuItem key={u._id} value={u._id}>
                  {u.displayName || u.email}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* Priority filter */}
        <Grid item xs={12} sm={6} md={3}>
          <FormControl fullWidth>
            <InputLabel>Priority</InputLabel>
            <Select
              value={priorityFilter ?? ""}
              onChange={(e) => setPriorityFilter(e.target.value)}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="alta">High</MenuItem>
              <MenuItem value="media">Medium</MenuItem>
              <MenuItem value="baja">Low</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        {/* Sort by filter */}
        <Grid item xs={12} sm={6} md={3}>
          <FormControl fullWidth>
            <InputLabel>Sort by</InputLabel>
            <Select
              value={sortBy ?? ""}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <MenuItem value="">None</MenuItem>
              <MenuItem value="deadline">Deadline</MenuItem>
              <MenuItem value="priority">Priority</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        {/* Sort order filter */}
        <Grid item xs={12} sm={6} md={3}>
          <FormControl fullWidth>
            <InputLabel>Order</InputLabel>
            <Select
              value={sortOrder ?? "asc"}
              onChange={(e) => setSortOrder(e.target.value)}
            >
              <MenuItem value="asc">Ascending</MenuItem>
              <MenuItem value="desc">Descending</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        {/* Refresh button */}
        <Grid item xs={12} sm={6} md={3}>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            onClick={fetchTasks}
            disabled={loading}
          >
            {loading ? "Loading..." : "Refresh"}
          </Button>
        </Grid>

        {/* Last sync info */}
        <Grid item xs={12} sm={6} md={3}>
          <Typography variant="body2" sx={{ mt: 2 }}>
            Last sync:{" "}
            {lastSync ? new Date(lastSync).toLocaleString() : "Never"}
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );
};

export default TaskFilters;
