/**
 * @fileoverview Modal component for adding a new member to a project.
 * Provides a dialog with a text field to enter a user ID or email,
 * and calls the backend service to add the member to the selected project.
 *
 * @module components/modals/AddMemberModal
 */

import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";
import { addMemberToProject } from "../../services/projectService.js";

/**
 * AddMemberModal component.
 *
 * @param {Object} props - Component props.
 * @param {boolean} props.open - Whether the modal is open.
 * @param {Function} props.onClose - Function to close the modal.
 * @param {string} props.projectId - ID of the project to add a member to.
 * @param {Function} props.onMemberAdded - Callback when a member is successfully added.
 * @returns {JSX.Element} The rendered modal component.
 */
const AddMemberModal = ({ open, onClose, projectId, onMemberAdded }) => {
  const [memberId, setMemberId] = useState("");

  const handleSubmit = async () => {
    try {
      const result = await addMemberToProject(projectId, memberId);
      onMemberAdded(result.project);
      onClose();
    } catch {
      alert("Error adding member ❌");
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Add Member to Project</DialogTitle>
      <DialogContent>
        <TextField
          label="User ID or Email"
          fullWidth
          value={memberId}
          onChange={(e) => setMemberId(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained">
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddMemberModal;
