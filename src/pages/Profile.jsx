/**
 * @fileoverview Profile component.
 * Allows users to view and update their profile information,
 * including avatar, name, email, role, and connected services.
 *
 * @module pages/Profile
 */

import React, { useState } from "react";
import {
  Container,
  Typography,
  Box,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Button,
  Avatar,
  IconButton,
  Snackbar,
  Alert,
  Grid,
  Chip,
} from "@mui/material";
import PhotoCamera from "@mui/icons-material/PhotoCamera";

/**
 * Profile component.
 * Renders a user profile page with editable fields and avatar upload.
 *
 * @function Profile
 * @returns {JSX.Element} Profile page layout
 */
const Profile = () => {
  const [profile, setProfile] = useState({
    fullName: "Your Name",
    email: "your@email.com",
    role: "Developer",
    avatar: null,
    dateJoined: "2024-01-15",
    lastLogin: "2025-07-28 09:42",
    services: ["GitHub", "Google"],
  });

  const [preview, setPreview] = useState(null);
  const [toastOpen, setToastOpen] = useState(false);

  /**
   * Handles avatar image upload and preview.
   */
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfile({ ...profile, avatar: file });
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  /**
   * Simulates saving profile changes and shows a success toast.
   */
  const handleSave = () => {
    setToastOpen(true);
    setTimeout(() => setToastOpen(false), 3000);
  };

  return (
    <Container maxWidth="sm" sx={{ py: 6 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        🧑 Profile
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        Your personal space inside the platform. Manage your profile details, role, and account preferences. Everything you need to personalize your workspace and collaborate confidently.
      </Typography>

      <Box sx={{ display: "flex", alignItems: "center", mt: 4, mb: 3 }}>
        <Avatar src={preview} sx={{ width: 80, height: 80 }} />
        <IconButton component="label" sx={{ ml: 2 }}>
          <PhotoCamera />
          <input type="file" accept="image/*" hidden onChange={handleAvatarChange} />
        </IconButton>
      </Box>

      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            label="Full Name"
            fullWidth
            value={profile.fullName}
            onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            label="Email Address"
            fullWidth
            value={profile.email}
            onChange={(e) => setProfile({ ...profile, email: e.target.value })}
          />
        </Grid>

        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel>Role</InputLabel>
            <Select
              value={profile.role}
              label="Role"
              onChange={(e) => setProfile({ ...profile, role: e.target.value })}
            >
              <MenuItem value="Admin">Admin</MenuItem>
              <MenuItem value="Developer">Developer</MenuItem>
              <MenuItem value="Reviewer">Reviewer</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            label="Date Joined"
            value={profile.dateJoined}
            fullWidth
            InputProps={{ readOnly: true }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Last Login"
            value={profile.lastLogin}
            fullWidth
            InputProps={{ readOnly: true }}
          />
        </Grid>

        <Grid item xs={12}>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Connected Services
          </Typography>
          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
            {profile.services.map((service, idx) => (
              <Chip key={idx} label={service} color="primary" variant="outlined" />
            ))}
          </Box>
        </Grid>
      </Grid>

      <Box textAlign="center" sx={{ mt: 4 }}>
        <Button variant="contained" onClick={handleSave}>
          Save Changes
        </Button>
      </Box>

      <Snackbar
        open={toastOpen}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity="success" variant="filled">
          Your settings have been saved successfully.
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Profile;

