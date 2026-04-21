/**
 * @fileoverview LocalTaskBoard component.
 * Displays local project tasks with filters, sorting, and role-based permissions.
 * Includes modals for viewing, editing, adding, and deleting tasks.
 *
 * @module pages/LocalTaskBoard
 */

import React, { useEffect, useState, useContext } from "react";
import {
  Typography,
  List,
  ListItem,
  ListItemText,
  Box,
  IconButton,
  Button,
  Chip,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase/auth.js";
import { useParams, useNavigate } from "react-router-dom";

import {
  getLocalTasks,
  updateLocalTask,
} from "../services/taskService.js";
import { getPublicUsers } from "../services/userService.js";
import TaskFilters from "../components/TaskFilters.jsx";
import EditLocalTaskModal from "../components/modals/EditLocalTaskModal.jsx";
import AddTaskModal from "../components/modals/AddTaskModal.jsx";
import TaskDetailModal from "../components/modals/TaskDetailModal.jsx";
import DeleteTaskModal from "../components/modals/DeleteTaskModal.jsx";
import { isUserAssigned } from "../utils/taskUtils.js";
import { AuthContext } from "../context/AuthContext.jsx";
import { getProjects, getLocalLists } from "../services/projectService.js";
import { useSnackbar } from "notistack";

const LocalTaskBoard = () => {
  const { id: projectId } = useParams();
  const navigate = useNavigate();
  const [user] = useAuthState(auth);
  const { role, userMongoId, firebaseUid } = useContext(AuthContext);
  const { enqueueSnackbar } = useSnackbar();

  // States
  const [projects, setProjects] = useState([]);
  const [project, setProject] = useState(null);
  const [lists, setLists] = useState([]);
  const [selectedListId, setSelectedListId] = useState("");
  const [allTasks, setAllTasks] = useState([]);
  const [visibleTasks, setVisibleTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");

  // Modals
  const [selectedTask, setSelectedTask] = useState(null);
  const [openView, setOpenView] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openConfirmDelete, setOpenConfirmDelete] = useState(false);
  const [openAdd, setOpenAdd] = useState(false);

  // Edit form
  const [form, setForm] = useState({
    title: "",
    description: "",
    priority: "",
    status: "todo",
    deadline: "",
  });

  const [loading, setLoading] = useState(false);

  // Load users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getPublicUsers();
        setUsers(Array.isArray(data) ? data : data.users || []);
      } catch {
        setUsers([]);
      }
    };
    fetchUsers();
  }, []);

  // Load projects
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await getProjects({ page: 1, limit: 50 });
        const arr = Array.isArray(data) ? data : data.projects || [];
        setProjects(arr);

        const current = arr.find((p) => p._id === projectId);
        setProject(current || null);
      } catch {
        setProjects([]);
        setProject(null);
      }
    };
    fetchProjects();
  }, [projectId]);

  // Load local lists
  useEffect(() => {
    const fetchLists = async () => {
      if (!projectId) return;
      try {
        const data = await getLocalLists(projectId);
        const arr = Array.isArray(data) ? data : data.lists || [];
        setLists(arr);
        setSelectedListId(arr[0]?._id || "");
      } catch {
        setLists([]);
      }
    };
    fetchLists();
  }, [projectId]);

  // Load tasks
  const fetchTasks = async () => {
    try {
      setLoading(true);
      const data = await getLocalTasks(projectId);
      const arr = Array.isArray(data) ? data : data.items || [];
      setAllTasks(arr);
    } catch {
      enqueueSnackbar("Error fetching local tasks ❌", { variant: "error" });
      setAllTasks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (projectId) fetchTasks();
  }, [projectId]);

  // Filter and sort tasks
  useEffect(() => {
    let arr = [...allTasks];
    if (selectedUser) {
      arr = arr.filter(
        (t) =>
          t.assignedTo === selectedUser ||
          (t.assignees || []).some(
            (a) => a._id === selectedUser || a.uid === selectedUser
          )
      );
    }
    if (priorityFilter) {
      arr = arr.filter(
        (t) => (t.priority || "").toLowerCase() === priorityFilter.toLowerCase()
      );
    }
    if (sortBy) {
      arr.sort((a, b) => {
        let valA = a[sortBy] || "";
        let valB = b[sortBy] || "";
        if (sortBy === "deadline") {
          valA = valA ? new Date(valA) : new Date(0);
          valB = valB ? new Date(valB) : new Date(0);
        }
        if (valA < valB) return sortOrder === "asc" ? -1 : 1;
        if (valA > valB) return sortOrder === "asc" ? 1 : -1;
        return 0;
      });
    }
    setVisibleTasks(arr);
  }, [allTasks, selectedUser, priorityFilter, sortBy, sortOrder]);
  
  // Handlers
  const handleEdit = (task) => {
  setSelectedTask(task);
  setForm({
    title: task.title,
    description: task.description,
    priority: task.priority || "",
    status: task.status || "todo",
    deadline: task.deadline || "",
    originalAssignees: task.assignees || [], 
  });
  setSelectedListId(task.listId);
  setOpenEdit(true);
};

/*
const handleUpdate = async (payloadFromModal) => {
  try {
    const updatedTask = await updateLocalTask(
      selectedListId,
      selectedTask._id,
      payloadFromModal
    );

    const normalizedTask = {
      ...selectedTask,   
      ...updatedTask,    
      assignees: (updatedTask.assignees?.length
        ? updatedTask.assignees
        : selectedTask.assignees || []
      ).map((a) => (typeof a === "object" && a._id ? a._id : a)),
    };

    setAllTasks((prev) =>
      prev.map((t) => (t._id === selectedTask._id ? normalizedTask : t))
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
                        t._id === selectedTask._id ? normalizedTask : t
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
    enqueueSnackbar("Task updated successfully ✅", { variant: "success" });
    window.dispatchEvent(new Event("tasksUpdated"));
  } catch {
    enqueueSnackbar("Error updating local task ❌", { variant: "error" });
  }
};
*/
const handleUpdate = async (payload) => {
  try {
    const updatedTask = await updateLocalTask(
      selectedListId,
      selectedTask._id,
      payload
    );

    const normalizedTask = {
      ...selectedTask,
      ...updatedTask,
      assignees: (updatedTask.assignees || selectedTask.assignees || []).map((a) =>
        typeof a === "object" && a._id ? a._id : a
      ),
    };

    setAllTasks((prev) =>
      prev.map((t) => (t._id === selectedTask._id ? normalizedTask : t))
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
                        t._id === selectedTask._id ? normalizedTask : t
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
    enqueueSnackbar("Task updated successfully ✅", { variant: "success" });
    window.dispatchEvent(new Event("tasksUpdated"));
  } catch {
    enqueueSnackbar("Error updating local task ❌", { variant: "error" });

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

    enqueueSnackbar(`Task "${selectedTask.title}" deleted ✅`, { variant: "success" });

    window.dispatchEvent(new Event("tasksUpdated"));
  } catch {
    enqueueSnackbar("Error deleting local task ❌", { variant: "error" });
  } finally {
    setOpenConfirmDelete(false);
    setSelectedTask(null);
  }
};

  // Permissions
  const canEditOrDelete = (task) => {
  if (role === "manager" || role === "admin") return true;
  if (role === "developer") {
    return isUserAssigned(task, userMongoId, firebaseUid);
  }
  return false;
};

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        📋 Project Local Tasks
      </Typography>

      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>Select project</InputLabel>
        <Select
          value={projectId || ""}
          onChange={(e) =>
            navigate(`/dashboard/projects/${e.target.value}/local-tasks`)
          }
        >
          {projects.map((p) => (
            <MenuItem key={p._id} value={p._id}>
              {p.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {(role === "manager" || role === "admin") && (
        <Button
          variant="contained"
          sx={{ mb: 2 }}
          onClick={() => setOpenAdd(true)}
        >
          ➕ Create Task
        </Button>
      )}

      <AddTaskModal
        open={openAdd}
        onClose={() => setOpenAdd(false)}
        onTaskAdded={(newTask) => {
        setAllTasks((prev) => [...prev, newTask]);
        enqueueSnackbar(`Task "${newTask.title}" created ✅`, { variant: "success" });
        }}
        listId={selectedListId || "default-list"}
        projectId={projectId}
      />

      <TaskFilters
        lists={lists}
        selectedListId={selectedListId}
        setSelectedListId={setSelectedListId}
        priorityFilter={priorityFilter}
        setPriorityFilter={setPriorityFilter}
        userOptions={projects.find((p) => p._id === projectId)?.members || []}
        selectedUser={selectedUser}
        setSelectedUser={setSelectedUser}
        fetchTasks={fetchTasks}
        loading={loading}
        lastSync={Date.now()}
        sortBy={sortBy}
        setSortBy={setSortBy}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
      />

      {loading ? (
        <Box sx={{ textAlign: "center", py: 4 }}>
          <CircularProgress />
          <Typography variant="body2" sx={{ mt: 2 }}>
            Loading local tasks...
          </Typography>
        </Box>
      ) : visibleTasks.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          No local tasks in this project.
        </Typography>
      ) : (
        <List>
          {visibleTasks.map((task) => {
            const canEditOrDeleteTask = canEditOrDelete(task);

            return (
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

                    {canEditOrDeleteTask && (
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
                  sx={{
                    pr: 8, 
                    display: "-webkit-box",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    WebkitBoxOrient: "vertical",
                    WebkitLineClamp: 2, 
                    maxWidth: "calc(100% - 120px)",
                  }}
                />
              </ListItem>
            );
          })}
        </List>
      )}

      {/* Modals */}
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
          enqueueSnackbar(`Task "${deletedTask.title}" deleted ✅`, { variant: "success" });
        }}
      />
    </Box>
  );
};

export default LocalTaskBoard;
