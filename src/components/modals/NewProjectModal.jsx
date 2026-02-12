/**
 * @fileoverview NewProjectModal component.
 * Provides a modal dialog to create a new project.
 * Includes form fields for project details and sprint information,
 * and handles submission to the backend.
 *
 * @module components/modals/NewProjectModal
 */

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Typography,
  Button,
  Box,
  IconButton,
  Modal,
  TextField,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { createProject } from "../../services/projectService.js";

/**
 * NewProjectModal Component
 *
 * @function NewProjectModal
 * @param {Object} props - Component props.
 * @param {boolean} props.open - Controls whether the modal is open.
 * @param {Function} props.onClose - Callback to close the modal.
 * @param {Function} props.onSubmit - Callback triggered when a project is successfully created.
 * @param {string} [props.source="local"] - Source type of the project (default: "local").
 * @returns {JSX.Element} Modal dialog component for creating a new project.
 *
 * @example
 * <NewProjectModal
 *   open={isOpen}
 *   onClose={handleClose}
 *   onSubmit={(project) => console.log("Project created:", project)}
 *   source="local"
 * />
 */
const NewProjectModal = ({ open, onClose, onSubmit, source = "local" }) => {
  const [formData, setFormData] = useState({
    projectName: "",
    description: "",
    sprintName: "",
    sprintDueDate: "",
    tasks: [],
  });

  /**
   * Handles form field changes.
   *
   * @function handleChange
   * @param {Object} e - Event object from input change.
   * @returns {void}
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  /**
   * Handles project creation by sending payload to backend.
   *
   * @async
   * @function handleSubmit
   * @param {Object} e - Event object from form submission.
   * @returns {Promise<void>} Resolves when the project is successfully created.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        name: formData.projectName,
        description: formData.description,
        sprintName: formData.sprintName,
        sprintDueDate: new Date(formData.sprintDueDate).getTime(),
        tasks: formData.tasks.map((t) => ({
          title: t.title,
          description: t.description,
          assignees: [t.assigneeId],
          status: t.status,
          deadline: new Date(t.deadline).getTime(),
          tags: t.tags,
          listId: t.listId || "default",
        })),
      };

      const response = await createProject(payload);

      if (onSubmit) onSubmit(response.project || response);
      onClose();
    } catch (error) {
      console.error("❌ Error creating project:", error);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <Modal open={open} onClose={onClose}>
          <motion.div
            initial={{ y: "-100vh", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "-100vh", opacity: 0 }}
            transition={{ type: "spring", stiffness: 120 }}
          >
            <Box
              sx={{
                position: "relative",
                bgcolor: "background.paper",
                p: 4,
                borderRadius: 2,
                maxWidth: 500,
                mx: "auto",
                mt: "5%",
                maxHeight: "80vh",
                overflowY: "auto",
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
              <Typography variant="h6" gutterBottom id="new-project-title">
                ➕ New Project
              </Typography>

              {/* Form fields */}
              <form onSubmit={handleSubmit}>
                <TextField
                  type="text"
                  name="projectName"
                  value={formData.projectName}
                  onChange={handleChange}
                  label="📝 Project Name"
                  fullWidth
                  required
                  sx={{ mb: 2 }}
                />
                <TextField
                  multiline
                  rows={3}
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  label="📄 Description"
                  fullWidth
                  required
                  sx={{ mb: 2 }}
                />
                <TextField
                  type="text"
                  name="sprintName"
                  value={formData.sprintName}
                  onChange={handleChange}
                  label="🏃 Sprint Name"
                  fullWidth
                  sx={{ mb: 2 }}
                />
                <TextField
                  type="date"
                  name="sprintDueDate"
                  value={formData.sprintDueDate}
                  onChange={handleChange}
                  label="📅 Sprint Due Date"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  sx={{ mb: 2 }}
                />

                {/* Action buttons */}
                <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 3 }}>
                  <Button type="button" variant="outlined" onClick={onClose}>
                    ❌ Cancel
                  </Button>
                  <Button type="submit" variant="contained">
                    ✅ Create Project
                  </Button>
                </Box>
              </form>
            </Box>
          </motion.div>
        </Modal>
      )}
    </AnimatePresence>
  );
};

export default NewProjectModal;
