/**
 * @fileoverview FileTree and FileNode components.
 * Provides a project file tree with support for creating, renaming, deleting,
 * and moving files/folders using drag-and-drop (`react-dnd`).
 *
 * @module components/FileTree
 */

import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  TextField,
  Button,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Collapse,
} from "@mui/material";
import {
  DriveFileRenameOutline,
  Delete,
  Folder,
  InsertDriveFile,
} from "@mui/icons-material";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import {
  getProjectFileTree,
  createProjectFile,
  renameProjectFile,
  deleteProjectFile,
  moveProjectFile,
} from "../services/fileService.js";

/**
 * FileNode Component
 *
 * @function FileNode
 * @description Represents a single node in the file tree (file or folder).
 * Supports rename, delete, and drag-and-drop move operations.
 *
 * @param {Object} props - Component props.
 * @param {Object} props.node - File or folder node object.
 * @param {string} props.node._id - Unique identifier of the node.
 * @param {string} props.node.name - Display name of the node.
 * @param {string} props.node.type - Type of the node ("file" or "folder").
 * @param {Array<Object>} [props.node.children] - Child nodes if the node is a folder.
 * @param {Function} props.onOpen - Callback when a file is opened.
 * @param {Function} props.onRename - Callback when a node is renamed.
 * @param {Function} props.onDelete - Callback when a node is deleted.
 * @param {Function} props.onMove - Callback when a node is moved via drag-and-drop.
 * @returns {JSX.Element} File node component.
 *
 * @example
 * <FileNode
 *   node={{ _id: "1", name: "index.js", type: "file" }}
 *   onOpen={(file) => console.log("Opened:", file)}
 *   onRename={(id, name) => console.log("Renamed:", id, name)}
 *   onDelete={(id) => console.log("Deleted:", id)}
 *   onMove={(id, parentId) => console.log("Moved:", id, "to", parentId)}
 * />
 */
const FileNode = ({ node, onOpen, onRename, onDelete, onMove }) => {
  const [expanded, setExpanded] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);
  const [newName, setNewName] = useState(node.name);

  const handleRename = () => {
    if (newName.trim()) {
      onRename(node._id, newName);
    }
    setIsRenaming(false);
  };

  const [{ isDragging }, drag] = useDrag(() => ({
    type: "file-node",
    item: { id: node._id },
  }));

  const [, drop] = useDrop(() => ({
    accept: "file-node",
    drop: (draggedItem) => {
      if (node.type !== "folder") return;
      if (draggedItem.id !== node._id) onMove(draggedItem.id, node._id);
    },
  }));

  return (
    <Box ref={drop} sx={{ ml: 1 }}>
      {/* Node header */}
      <Box
        ref={drag}
        sx={{
          opacity: isDragging ? 0.5 : 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          cursor: "pointer",
          p: 0.5,
          borderRadius: 1,
          "&:hover": { bgcolor: "rgba(255,255,255,0.05)" },
        }}
      >
        <Box
          sx={{ display: "flex", alignItems: "center", flexGrow: 1 }}
          onClick={() =>
            node.type === "folder" ? setExpanded(!expanded) : onOpen(node)
          }
        >
          {node.type === "folder" ? (
            <Folder fontSize="small" />
          ) : (
            <InsertDriveFile fontSize="small" />
          )}
          {isRenaming ? (
            <TextField
              size="small"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onBlur={handleRename}
              onKeyDown={(e) => e.key === "Enter" && handleRename()}
              autoFocus
              sx={{ ml: 1 }}
            />
          ) : (
            <Typography sx={{ ml: 1, fontSize: "0.9rem" }}>
              {node.name}
            </Typography>
          )}
        </Box>

        {/* Action buttons */}
        <Box sx={{ display: "flex", gap: 0.5 }}>
          <IconButton size="small" onClick={() => setIsRenaming(true)}>
            <DriveFileRenameOutline fontSize="small" />
          </IconButton>
          <IconButton size="small" onClick={() => onDelete(node._id)}>
            <Delete fontSize="small" />
          </IconButton>
        </Box>
      </Box>

      {/* Children (if folder) */}
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        {node.children?.map((child) => (
          <FileNode
            key={child._id}
            node={child}
            onOpen={onOpen}
            onRename={onRename}
            onDelete={onDelete}
            onMove={onMove}
          />
        ))}
      </Collapse>
    </Box>
  );
};

/**
 * FileTree Component
 *
 * @function FileTree
 * @description Displays the project file tree with support for creating, renaming, deleting, and moving files/folders.
 *
 * @param {Object} props - Component props.
 * @param {string} props.projectId - ID of the project to fetch the file tree for.
 * @param {Function} props.onOpenFile - Callback when a file is opened.
 * @returns {JSX.Element} File tree component.
 *
 * @example
 * <FileTree
 *   projectId="12345"
 *   onOpenFile={(file) => console.log("Opened file:", file)}
 * />
 */
const FileTree = ({ projectId, onOpenFile }) => {
  const [tree, setTree] = useState([]);
  const [newName, setNewName] = useState("");
  const [newType, setNewType] = useState("folder");
  const [newContent, setNewContent] = useState("");

  /**
   * Fetches the file tree from backend service.
   *
   * @async
   * @function fetchTree
   * @returns {Promise<void>} Resolves when tree state is updated.
   */
  const fetchTree = async () => {
    if (!projectId) return;
    try {
      const data = await getProjectFileTree(projectId);
      setTree(data);
    } catch (err) {
      console.error("❌ Error loading file tree:", err);
    }
  };

  useEffect(() => {
    fetchTree();
  }, [projectId]);

  /**
   * Creates a new file or folder node in the project.
   *
   * @async
   * @function createNode
   * @returns {Promise<void>} Resolves when node is created and tree updated.
   */
  const createNode = async () => {
    if (!newName.trim() || !projectId) return;

    const payload = {
      projectId,
      name: newName,
      type: newType,
      parentId: null,
      ...(newType === "file" && { content: newContent }),
    };

    try {
      const data = await createProjectFile(payload);
      if (data.type === "file") onOpenFile(data);
      setNewName("");
      setNewContent("");
      setNewType("folder");
      fetchTree();
    } catch (error) {
      console.error("❌ Error creating node:", error);
    }
  };

  /**
   * Renames a node in the project.
   *
   * @async
   * @function renameNode
   * @param {string} id - Node ID.
   * @param {string} newName - New name for the node.
   */
  const renameNode = async (id, newName) => {
    await renameProjectFile(id, newName);
    fetchTree();
  };

  /**
   * Deletes a node from the project.
   *
   * @async
   * @function deleteNode
   * @param {string} id - Node ID.
   */
  const deleteNode = async (id) => {
    await deleteProjectFile(id);
    fetchTree();
  };

    /**
   * Moves a node to a new parent folder.
   *
   * @async
   * @function moveNode
   * @param {string} id - Node ID.
   * @param {string} newParentId - New parent folder ID.
   * @returns {Promise<void>} Resolves when the node is moved and tree updated.
   */
  const moveNode = async (id, newParentId) => {
    await moveProjectFile(id, newParentId);
    fetchTree();
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          📂 Project
        </Typography>

        {/* Form for creating new file/folder */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          <TextField
            size="small"
            label="Name"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />
          <FormControl size="small">
            <InputLabel>Type</InputLabel>
            <Select
              value={newType}
              label="Type"
              onChange={(e) => setNewType(e.target.value)}
            >
              <MenuItem value="folder">Folder</MenuItem>
              <MenuItem value="file">File</MenuItem>
            </Select>
          </FormControl>
          {newType === "file" && (
            <TextField
              size="small"
              label="Initial Content"
              multiline
              rows={3}
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
            />
          )}
          <Button variant="contained" onClick={createNode}>
            ➕ Create {newType === "file" ? "File" : "Folder"}
          </Button>
        </Box>

        {/* Render file tree */}
        <Box sx={{ mt: 2, flex: 1, overflowY: "auto" }}>
          {tree.map((node) => (
            <FileNode
              key={node._id}
              node={node}
              onOpen={onOpenFile}
              onRename={renameNode}
              onDelete={deleteNode}
              onMove={moveNode}
            />
          ))}
        </Box>
      </Box>
    </DndProvider>
  );
};

export default FileTree;
