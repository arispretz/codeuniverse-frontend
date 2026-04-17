/**
 * @fileoverview ProjectManagementDashboard component.
 * Provides a management view of projects with filters, lists, tasks,
 * and modals for creating and editing projects, lists, and tasks.
 *
 * @module pages/ProjectManagementDashboard
 */

import React, { useState, useEffect, useContext } from "react";
import {
  Grid, 
  Card,
  CardContent,
  Typography,
  AvatarGroup,
  Avatar,
  Chip,
  LinearProgress,
  Button,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Box,
  Snackbar,
  Alert,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useSnackbar } from "notistack";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase/auth.js";

import NewProjectModal from "../components/modals/NewProjectModal";
import AddMemberModal from "../components/modals/AddMemberModal";
import NewKanbanListModal from "../components/modals/NewKanbanListModal";
import NewListModal from "../components/modals/NewListModal";
import AddKanbanTaskModal from "../components/modals/AddKanbanTaskModal";
import AddTaskModal from "../components/modals/AddTaskModal";

import TaskDetailModal from "../components/modals/TaskDetailModal.jsx";
import EditLocalTaskModal from "../components/modals/EditLocalTaskModal.jsx";
import DeleteTaskModal from "../components/modals/DeleteTaskModal.jsx";

import { AuthContext } from "../context/AuthContext.jsx";
import { isUserAssigned } from "../utils/taskUtils.js";

import { getProjectsFull } from "../services/projectService.js";
import { deleteKanbanTask, updateKanbanTask } from "../services/kanbanService.js";
import { deleteLocalTask, updateLocalTask } from "../services/taskService.js";

const ProjectManagementDashboard = () => {
  const [filters, setFilters] = useState({ owner: "", status: "", tag: "", search: "" });
  const [isModalOpen, setModalOpen] = useState(false);
  const [projects, setProjects] = useState([]);
  const [addMemberModalOpen, setAddMemberModalOpen] = useState(false);
  const [listModalOpen, setListModalOpen] = useState(false);
  const [kanbanListModalOpen, setKanbanListModalOpen] = useState(false);
  const [addKanbanTaskModalOpen, setAddKanbanTaskModalOpen] = useState(false);
  const [addLocalTaskModalOpen, setAddLocalTaskModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState("");
  const [selectedList, setSelectedList] = useState(null);

  const { enqueueSnackbar } = useSnackbar();
  const [user] = useAuthState(auth);
  const { role, userMongoId, firebaseUid } = useContext(AuthContext);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const [selectedTask, setSelectedTask] = useState(null);
  const [form, setForm] = useState({
    title: "",
    description: "",
    priority: "",
    status: "todo",
    deadline: "",
  });
  const [openEdit, setOpenEdit] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [openConfirmDelete, setOpenConfirmDelete] = useState(false);
  const [allTasks, setAllTasks] = useState([]);
  const [selectedListId, setSelectedListId] = useState("");

  const showSnackbar = (msg, sev = "success") => {
    setSnackbarMessage(msg);
    setSnackbarSeverity(sev);
    setSnackbarOpen(true);
  };

  const fetchProjects = async () => {
    try {
      if (!user) return;
      const data = await getProjectsFull({ page, limit: 6 });
      setProjects(data.projects || []);
      setTotalPages(data.totalPages || 1);
    } catch {
      setProjects([]);
      showSnackbar("Error loading projects", "error");
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [user, page]);

  const handleFilterChange = (field) => (e) => {
    setFilters({ ...filters, [field]: e.target.value });
  };

  const filteredProjects = projects.filter(
  (project) =>
    (!filters.owner || project.members?.some((m) => m.username === filters.owner)) &&
    (!filters.status || project.status === filters.status) &&
    (!filters.tag || project.tag === filters.tag) &&
    (!filters.search ||
      project.name.toLowerCase().includes(filters.search.toLowerCase()) ||
      project.description.toLowerCase().includes(filters.search.toLowerCase()))
);

  const handleProjectSubmit = (newProject) => {
    setProjects((prev) => [...prev, newProject]);
  };
  
  const handleEdit = (task) => {
  setSelectedTask(task);
  setForm({
    title: task.title,
    description: task.description,
    priority: task.priority || "",
    status: task.status || "todo",
    deadline: task.deadline || "",
  });
  setSelectedListId(task.listId);
  setOpenEdit(true);
};

  const handleUpdate = async () => {
  try {
    const updatedTask = await updateLocalTask(
      selectedListId,
      selectedTask._id,
      form
    );

    setAllTasks((prev) =>
      prev.map((t) => (t._id === selectedTask._id ? updatedTask : t))
    );

    setProjects((prev) =>
      prev.map((proj) =>
        proj._id === selectedProject
          ? {
              ...proj,
              localLists: proj.localLists.map((list) =>
                list._id === selectedListId
                  ? {
                      ...list,
                      tasks: list.tasks.map((t) =>
                        t._id === selectedTask._id ? updatedTask : t
                      ),
                    }
                  : list
              ),
            }
          : proj
      )
    );

    setOpenEdit(false);
    setSelectedTask(null);
    showSnackbar("Task updated successfully ✅", "success");

    window.dispatchEvent(new Event("tasksUpdated"));
  } catch {
    showSnackbar("Error updating local task ❌", "error");
  }
};

  const handleView = (task) => {
    setSelectedTask(task);
    setOpenView(true);
  };

  const handleDelete = async () => {
  try {
    await deleteLocalTask(selectedTask._id);

    setAllTasks((prev) => prev.filter((t) => t._id !== selectedTask._id));

    setProjects((prev) =>
      prev.map((proj) =>
        proj._id === selectedProject
          ? {
              ...proj,
              localLists: proj.localLists.map((list) =>
                list._id === selectedListId
                  ? {
                      ...list,
                      tasks: list.tasks.filter((t) => t._id !== selectedTask._id),
                    }
                  : list
              ),
            }
          : proj
      )
    );

    showSnackbar("Task deleted ✅", "success");

    window.dispatchEvent(new Event("tasksUpdated"));
  } catch {
    showSnackbar("Error deleting local task ❌", "error");
  } finally {
    setOpenConfirmDelete(false);
    setSelectedTask(null);
  }
};

  useEffect(() => {
    const listener = () => {
      fetchProjects(); 
    };

    window.addEventListener("tasksUpdated", listener);

  return () => {
    window.removeEventListener("tasksUpdated", listener);
  };
}, []);

  const canEditOrDelete = (task) => {
    if (role === "manager" || role === "admin") return true;
    if (role === "developer") {
      return isUserAssigned(task, userMongoId, firebaseUid);
    }
    return false;
  };

  return (
    <>
      <Typography variant="h4" gutterBottom>
        📊 Your Projects at a Glance
      </Typography>

      <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setModalOpen(true)}
        >
          New Project
        </Button>
      </Box>

      {/* Filters */}
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} sm={3}>
          <FormControl fullWidth>
            <InputLabel>Owner</InputLabel>
            <Select value={filters.owner} onChange={handleFilterChange("owner")}>
              <MenuItem value="">All</MenuItem>
              {projects.flatMap((p) => p.members || []).map((m, idx) => (
                <MenuItem key={idx} value={m.username}>
                  {m.username}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={3}>
          <FormControl fullWidth>
            <InputLabel>Status</InputLabel>
            <Select value={filters.status} onChange={handleFilterChange("status")}>
              <MenuItem value="">All</MenuItem>
              <MenuItem value="In Progress">In Progress</MenuItem>
              <MenuItem value="Done">Done</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={3}>
          <TextField
            label="Tag"
            fullWidth
            value={filters.tag}
            onChange={handleFilterChange("tag")}
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <TextField
            label="Search"
            fullWidth
            value={filters.search}
            onChange={handleFilterChange("search")}
          />
        </Grid>
      </Grid>
            <Grid container spacing={2}>
        {filteredProjects.map((project) => (
          <Grid key={project._id} item sx={{ width: '80%' }}>
            <Card>
              <CardContent>
                <Typography variant="h6">{project.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {project.description}
                </Typography>

                {Array.isArray(project.members) && (
                  <AvatarGroup max={4} sx={{ my: 1 }}>
                    {project.members.map((member, idx) => (
                      <Avatar
                        key={idx}
                        alt={member?.username || "Anon"}
                        src={member?.avatarUrl || ""}
                      >
                        {member?.username?.[0] || "?"}
                      </Avatar>
                    ))}
                  </AvatarGroup>
                )}

                <Chip
                  label={project.status}
                  color={project.status === "Done" ? "success" : "warning"}
                />

                <Typography variant="body2" sx={{ mt: 1 }}>
                  Progress: {Math.round(project.progress) || 0}%
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={project.progress || 0}
                  sx={{ mt: 1 }}
                />

                <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => {
                      setSelectedProject(project._id);
                      setAddMemberModalOpen(true);
                    }}
                  >
                    ➕ Add Member
                  </Button>

                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => {
                      setSelectedProject(project._id);
                      setListModalOpen(true);
                    }}
                  >
                    ➕ Create Local List
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => {
                      setSelectedProject(project._id);
                      setKanbanListModalOpen(true);
                    }}
                  >
                    ➕ Create Kanban List
                  </Button>
                </Box>

                {/* Kanban Lists */}
                <Typography variant="subtitle1" sx={{ mt: 2 }}>
                  🧱 Kanban Lists
                </Typography>
                {project.kanbanLists?.map((list) => (
                  <Box key={list._id} sx={{ mb: 1 }}>
                    <Typography variant="body2">{list.name}</Typography>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => {
                        setSelectedProject(project._id);
                        setSelectedList(list._id);
                        setAddKanbanTaskModalOpen(true);
                      }}
                    >
                      ➕ Add Kanban Task
                    </Button>
                    {list.tasks?.map((task) => (
                      <ListItem
                        key={task._id}
                        secondaryAction={
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <Chip
                              label={task.status || "Pending"}
                              color="info"
                              size="small"
                            />
                            <IconButton
                              edge="end"
                              color="primary"
                              onClick={() => handleView(task)}
                            >
                              <VisibilityIcon />
                            </IconButton>
                            {canEditOrDelete(task) && (
                              <>
                                <IconButton
                                  edge="end"
                                  color="secondary"
                                  onClick={() => handleEdit(task)}
                                >
                                  <EditIcon />
                                </IconButton>
                                <IconButton
                                  edge="end"
                                  color="error"
                                  onClick={() => {
                                    setSelectedTask(task);
                                    setOpenConfirmDelete(true);
                                  }}
                                >
                                  <DeleteIcon />
                                </IconButton>
                              </>
                            )}
                          </Box>
                        }
                      >
                        <ListItemText
                          primary={task.title}
                          secondary={task.description}
                        />
                      </ListItem>
                    ))}
                  </Box>
                ))}

                {/* Local Lists */}
                <Typography variant="subtitle1" sx={{ mt: 2 }}>
                  📋 Local Lists
                </Typography>
                {project.localLists?.map((list) => (
                  <Box key={list._id} sx={{ mb: 1 }}>
                    <Typography variant="body2">{list.name}</Typography>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => {
                        setSelectedProject(project._id);
                        setSelectedList(list._id);
                        setAddLocalTaskModalOpen(true);
                      }}
                    >
                      ➕ Add Local Task
                    </Button>
                    {list.tasks?.map((task) => (
                      <ListItem
                        key={task._id}
                        secondaryAction={
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <Chip
                              label={task.status || "Pending"}
                              color="info"
                              size="small"
                            />
                            <IconButton
                              edge="end"
                              color="primary"
                              onClick={() => handleView(task)}
                            >
                              <VisibilityIcon />
                            </IconButton>
                            {canEditOrDelete(task) && (
                              <>
                                <IconButton
                                  edge="end"
                                  color="secondary"
                                  onClick={() => handleEdit(task)}
                                >
                                  <EditIcon />
                                </IconButton>
                                <IconButton
                                  edge="end"
                                  color="error"
                                  onClick={() => {
                                    setSelectedTask(task);
                                    setOpenConfirmDelete(true);
                                  }}
                                >
                                  <DeleteIcon />
                                </IconButton>
                              </>
                            )}
                          </Box>
                        }
                      >
                        <ListItemText
                          primary={task.title}
                          secondary={task.description}
                        />
                      </ListItem>
                    ))}
                  </Box>
                ))}
              </CardContent>
            </Card>
          </Grid>
        ))}
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

      {/* Modals for creating projects/lists/tasks */}
      <NewProjectModal
        open={isModalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleProjectSubmit}
        source="backend"
      />
      <AddMemberModal
        open={addMemberModalOpen}
        onClose={() => setAddMemberModalOpen(false)}
        projectId={selectedProject}
        onMemberAdded={(updatedProject) => {
          enqueueSnackbar("Member added ✅", { variant: "success" });
          fetchProjects();
        }}
      />

      <NewListModal
        open={listModalOpen}
        onClose={() => setListModalOpen(false)}
        projectId={selectedProject}
        source="backend"
        onCreated={(newList) => {
          enqueueSnackbar(`Local list "${newList.name}" created successfully ✅`, {
            variant: "success",
          });
          fetchProjects();
        }}
      />

      <NewKanbanListModal
        open={kanbanListModalOpen}
        onClose={() => setKanbanListModalOpen(false)}
        projectId={selectedProject}
        onCreated={(newList) => {
          enqueueSnackbar(`Kanban list "${newList.name}" created successfully ✅`, {
            variant: "success",
          });
          fetchProjects();
        }}
      />

      <AddKanbanTaskModal
        open={addKanbanTaskModalOpen}
        onClose={() => setAddKanbanTaskModalOpen(false)}
        onTaskAdded={(task) => {
          enqueueSnackbar(`Kanban task "${task.title}" created successfully ✅`, {
            variant: "success",
          });
          setProjects((prev) =>
            prev.map((proj) =>
              proj._id === selectedProject
                ? {
                    ...proj,
                    kanbanLists: proj.kanbanLists.map((list) =>
                      list._id === selectedList
                        ? { ...list, tasks: [...list.tasks, task] }
                        : list
                    ),
                  }
                : proj
            )
          );

          window.dispatchEvent(new Event("tasksUpdated"));
        }}
        listId={selectedList}
        projectId={selectedProject}
      />

      <AddTaskModal
        open={addLocalTaskModalOpen}
        onClose={() => setAddLocalTaskModalOpen(false)}
        onTaskAdded={(task) => {
          enqueueSnackbar(`Local task "${task.title}" created successfully ✅`, {
            variant: "success",
          });
          setProjects((prev) =>
            prev.map((proj) =>
              proj._id === selectedProject
                ? {
                    ...proj,
                    localLists: proj.localLists.map((list) =>
                      list._id === selectedList
                        ? { ...list, tasks: [...list.tasks, task] }
                        : list
                    ),
                  }
                : proj
            )
          );

          window.dispatchEvent(new Event("tasksUpdated"));
        }}
        listId={selectedList}
        projectId={selectedProject}
      />

      {/* Task management modals */}
      <TaskDetailModal
        open={openView}
        onClose={() => setOpenView(false)}
        task={selectedTask}
        avatars={{}}
        onCommentAdded={(newComment) => {
          setAllTasks((prev) =>
            prev.map((t) =>
              t._id === selectedTask._id
                ? { ...t, comments: [...(t.comments || []), newComment] }
                : t
            )
          );
        }}
      />

      <EditLocalTaskModal
        open={openEdit}
        onClose={() => setOpenEdit(false)}
        form={form}
        setForm={setForm}
        handleUpdate={handleUpdate}
      />

      <DeleteTaskModal
        open={openConfirmDelete}
        onClose={() => setOpenConfirmDelete(false)}
        task={selectedTask}
        onTaskDeleted={(deletedTask) => {
          setAllTasks((prev) => prev.filter((t) => t._id !== deletedTask._id));
          showSnackbar("Task deleted ✅", "success");
        }}
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
    </>
  );
};

export default ProjectManagementDashboard;
