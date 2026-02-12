/**
 * @fileoverview Settings component.
 * Provides user preferences and platform configuration options.
 * Includes appearance, language, notifications, integrations, and security settings.
 *
 * @module pages/Settings
 */

import React, { useState } from "react";
import {
  Container,
  Typography,
  Tabs,
  Tab,
  Box,
  FormControlLabel,
  Switch,
  Select,
  MenuItem,
  Button,
  TextField,
  Alert,
} from "@mui/material";

/**
 * TabPanel component for rendering tab content conditionally.
 *
 * @function TabPanel
 * @param {object} props - Component props
 * @param {React.ReactNode} props.children - Content to render
 * @param {number} props.value - Current tab index
 * @param {number} props.index - Index of this panel
 * @returns {JSX.Element|null} Tab content if active
 */
function TabPanel({ children, value, index }) {
  return value === index ? <Box sx={{ pt: 2 }}>{children}</Box> : null;
}

/**
 * Settings component.
 * Renders user settings for appearance, language, notifications, integrations, and security.
 *
 * @function Settings
 * @returns {JSX.Element} Settings page layout
 */
const Settings = () => {
  const [tab, setTab] = useState(0);
  const [theme, setTheme] = useState("light");
  const [language, setLanguage] = useState("en");
  const [emailNotif, setEmailNotif] = useState(true);
  const [pushNotif, setPushNotif] = useState(false);
  const [oauthConnected, setOauthConnected] = useState({
    github: true,
    gitlab: false,
    google: true,
  });
  const [showAlert, setShowAlert] = useState(false);

  /**
   * Handles saving settings and shows confirmation alert.
   */
  const handleSave = () => {
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
  };

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        ⚙️ Settings
      </Typography>
      <Typography variant="body1" color="text.secondary" gutterBottom>
        Tailor your experience to match your workflow. Customize platform behavior, integrations, and account security to suit your style.
      </Typography>

      <Tabs
        value={tab}
        onChange={(_, newTab) => setTab(newTab)}
        sx={{ mt: 4 }}
        variant="scrollable"
      >
        <Tab label="Appearance" />
        <Tab label="Language" />
        <Tab label="Notifications" />
        <Tab label="Integrations" />
        <Tab label="Security" />
      </Tabs>

      {/* Appearance */}
      <TabPanel value={tab} index={0}>
        <FormControlLabel
          control={
            <Switch
              checked={theme === "dark"}
              onChange={() => setTheme(theme === "light" ? "dark" : "light")}
            />
          }
          label={`Theme: ${theme === "light" ? "Light" : "Dark"}`}
        />
      </TabPanel>

      {/* Language */}
      <TabPanel value={tab} index={1}>
        <Typography variant="subtitle1">Language Selection</Typography>
        <Select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          sx={{ mt: 1, width: "200px" }}
        >
          <MenuItem value="en">English</MenuItem>
          <MenuItem value="es">Spanish</MenuItem>
        </Select>
      </TabPanel>

      {/* Notifications */}
      <TabPanel value={tab} index={2}>
        <FormControlLabel
          control={
            <Switch
              checked={emailNotif}
              onChange={() => setEmailNotif(!emailNotif)}
            />
          }
          label="Email Notifications"
        />
        <FormControlLabel
          control={
            <Switch
              checked={pushNotif}
              onChange={() => setPushNotif(!pushNotif)}
            />
          }
          label="Push Notifications"
        />
      </TabPanel>

      {/* Integrations */}
      <TabPanel value={tab} index={3}>
        <Typography variant="subtitle1" gutterBottom>
          OAuth Connections
        </Typography>
        {["GitHub", "GitLab", "Google"].map((provider) => {
          const key = provider.toLowerCase();
          return (
            <FormControlLabel
              key={provider}
              control={
                <Switch
                  checked={oauthConnected[key]}
                  onChange={() =>
                    setOauthConnected((prev) => ({
                      ...prev,
                      [key]: !prev[key],
                    }))
                  }
                />
              }
              label={`${provider}: ${
                oauthConnected[key] ? "Connected" : "Disconnected"
              }`}
            />
          );
        })}
      </TabPanel>

      {/* Security */}
      <TabPanel value={tab} index={4}>
        <FormControlLabel
          control={<Switch />}
          label="Enable Two-Factor Authentication"
        />
        <TextField
          type="password"
          label="Reset Password"
          variant="outlined"
          sx={{ mt: 2, width: "300px" }}
        />
      </TabPanel>

      {/* Save button and alert */}
      <Box sx={{ mt: 4 }}>
        <Button variant="contained" onClick={handleSave}>
          Save Settings
        </Button>
        {showAlert && (
          <Alert severity="success" sx={{ mt: 2 }}>
            Settings saved successfully!
          </Alert>
        )}
      </Box>
    </Container>
  );
};

export default Settings;
