/**
 * @fileoverview NewKanbanListModal component.
 * Provides a modal dialog to create a new Kanban list.
 * Includes form fields for list name and due date, and handles submission to the backend.
 *
 * @module components/modals/NewKanbanListModal
 */

import React, { useState } from "react";
import {
  Modal,
  Box,
  TextField,
  Button,
  IconButton,
  Typography,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import CloseIcon from "@mui/icons-material/Close";
import { createKanbanList } from "../../services/projectService.js";

/**
 * NewKanbanListModal Component
 *
 * @function NewKanbanListModal
 * @param {Object} props - Component props.
 * @param {boolean} props.open - Controls whether the modal is open.
 * @param {Function} props.onClose - Callback to close the modal.
 * @param {string} props.projectId - ID of the project associated with the list (must come from environment/backend).
 * @param {Function} props.onCreated - Callback triggered when a list is successfully created.
 * @returns {JSX.Element} Modal dialog component for creating a new Kanban list.
 *
 * @example
 * <NewKanbanListModal
 *   open={isOpen}
 *   onClose={handleClose}
 *   projectId="12345"
 *   onCreated={(list) => console.log("List created:", list)}
 * />
 */
const NewKanbanListModal = ({ open, onClose, projectId, onCreated }) => {
  const [name, setName] = useState("");
  const [dueDate, setDueDate] = useState(null);
  const [loading, setLoading] = useState(false);

  /**
   * Handles list creation by sending payload to backend.
   *
   * @async
   * @function handleCreate
   * @returns {Promise<void>} Resolves when the list is successfully created.
   */
  const handleCreate = async () => {
    if (!name || !dueDate || !projectId) return;

    setLoading(true);
    try {
      const data = await createKanbanList(projectId, {
        name,
        dueDate: dueDate.getTime(),
      });

      if (onCreated) onCreated(data.list);
      setName("");
      setDueDate(null);
      onClose();
    } catch (err) {
      console.error("❌ Error creating Kanban list:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      {/* Modal content */}
      <Box
        sx={{
          width: 400,
          maxHeight: "80vh",
          overflowY: "auto",
          bgcolor: "background.paper",
          p: 4,
          mx: "auto",
          mt: "5%",
          borderRadius: 2,
          position: "relative",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Close button */}
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>

        {/* Modal title */}
        <Typography variant="h6" gutterBottom>
          ➕ Create New Kanban List
        </Typography>

        {/* Form fields */}
        <Box sx={{ flex: 1, overflowY: "auto", pr: 1 }}>
          <TextField
            label="📝 List Name"
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
            sx={{ mt: 1, mb: 2 }}
          />
          <DatePicker
            label="📅 Due Date"
            value={dueDate}
            onChange={(newDate) => setDueDate(newDate)}
            slotProps={{ textField: { fullWidth: true } }}
          />
        </Box>

        {/* Action buttons */}
        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1, mt: 3 }}>
          <Button onClick={onClose}>❌ Cancel</Button>
          <Button
            onClick={handleCreate}
            variant="contained"
            disabled={loading || !name || !dueDate}
          >
            {loading ? "⏳ Creating..." : "✅ Create"}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default NewKanbanListModal;
