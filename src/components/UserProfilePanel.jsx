/**
 * @fileoverview UserProfilePanel component.
 * Displays the user's profile information, preferred coding style, and personalized tips.
 * Allows updating the preferred coding style via a dropdown selector.
 *
 * Integrates with `profileService` to:
 * - Fetch user profile data (`getUserProfile`)
 * - Fetch personalized tips (`getUserTips`)
 * - Update preferred coding style (`updateUserStyle`)
 *
 * @module components/UserProfilePanel
 */

import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Select,
  MenuItem,
  Paper,
  Alert,
} from "@mui/material";

import {
  getUserProfile,
  getUserTips,
  updateUserStyle,
} from "../services/profileService.js";

/**
 * UserProfilePanel Component
 *
 * @function UserProfilePanel
 * @returns {JSX.Element} User profile panel component.
 *
 * @example
 * <UserProfilePanel />
 */
const UserProfilePanel = () => {
  const [profile, setProfile] = useState(null);
  const [style, setStyle] = useState("");
  const [tips, setTips] = useState([]);

  useEffect(() => {
    /**
     * Fetches user profile and tips from backend service.
     *
     * @async
     * @function fetchData
     * @returns {Promise<void>}
     */
    const fetchData = async () => {
      try {
        const profileData = await getUserProfile();
        setProfile(profileData);
        setStyle(profileData.preferred_style);

        const tipsData = await getUserTips();
        setTips(tipsData);
      } catch (err) {
        console.error("❌ Error loading profile or tips:", err);
      }
    };
    fetchData();
  }, []);

  /**
   * Handles updating the user's preferred style.
   *
   * @async
   * @function handleStyleChange
   * @param {Object} e - Event object from Select component.
   * @returns {Promise<void>}
   */
  const handleStyleChange = async (e) => {
    const newStyle = e.target.value;
    setStyle(newStyle);
    try {
      await updateUserStyle(newStyle);
    } catch (err) {
      console.error("❌ Error updating style:", err);
    }
  };

  return (
    <Paper sx={{ p: 3, mt: 4 }}>
      <Typography variant="h6">👤 Your Profile</Typography>
      {profile && (
        <>
          {/* Preferred language */}
          <Typography variant="body1" sx={{ mt: 2 }}>
            Preferred language: <strong>{profile.preferred_language}</strong>
          </Typography>

          {/* Preferred style selector */}
          <Typography variant="body1" sx={{ mt: 1 }}>
            Preferred style:
          </Typography>
          <Select
            value={style}
            onChange={handleStyleChange}
            sx={{ mt: 1, mb: 2 }}
          >
            <MenuItem value="functional">Functional</MenuItem>
            <MenuItem value="imperative">Imperative</MenuItem>
            <MenuItem value="object-oriented">Object-Oriented</MenuItem>
          </Select>

          {/* Last used timestamp */}
          <Typography variant="body2" color="text.secondary">
            Last used: {new Date(profile.last_used).toLocaleString()}
          </Typography>
        </>
      )}

      {/* Personalized tips */}
      {tips.length > 0 && (
        <Box mt={3}>
          <Typography variant="subtitle1">🧠 Suggestions for you</Typography>
          {tips.map((tip, i) => (
            <Alert key={i} severity="info" sx={{ mt: 1 }}>
              {tip}
            </Alert>
          ))}
        </Box>
      )}
    </Paper>
  );
};

export default UserProfilePanel;
