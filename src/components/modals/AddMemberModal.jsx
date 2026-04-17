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
import { useSnackbar } from "notistack";

const AddMemberModal = ({ open, onClose, projectId, onMemberAdded }) => {
  const { enqueueSnackbar } = useSnackbar();
  const [memberId, setMemberId] = useState("");

  const handleSubmit = async () => {
    if (!memberId?.trim()) {
      enqueueSnackbar("⚠️ Please enter a user ID or email.", { variant: "warning" });
      return;
    }

    try {
      const input = memberId.trim();
      const isEmail = input.includes("@");

      const result = await addMemberToProject(
        projectId,
        isEmail ? { email: input } : { memberId: input }
      );

      onMemberAdded(result.project);
      onClose();
    } catch (err) {
      const message = err.response?.data?.error || err.message;
      enqueueSnackbar(`Error adding member ❌ ${message}`, { variant: "error" });
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>➕ Add Member to Project</DialogTitle>
      <DialogContent>
        <TextField
          label="User ID or Email"
          fullWidth
          value={memberId}
          onChange={(e) => setMemberId(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>❌ Cancel</Button>
        <Button onClick={handleSubmit} variant="contained">
          ✅ Add
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddMemberModal;
