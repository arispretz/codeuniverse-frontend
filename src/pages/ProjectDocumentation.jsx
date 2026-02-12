/**
 * @fileoverview ProjectDocumentation component.
 * Provides a markdown editor with live preview and localStorage persistence.
 * Includes a file tree drawer for switching between documents.
 *
 * @module pages/ProjectDocumentation
 */

import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  Typography,
  Divider,
  TextField,
  Snackbar,
  Alert,
} from "@mui/material";
import ReactMarkdown from "react-markdown";

/**
 * ProjectDocumentation component.
 * Renders a markdown editor with preview and localStorage persistence.
 *
 * @function ProjectDocumentation
 * @returns {JSX.Element} Project documentation layout
 */
const ProjectDocumentation = () => {
  const [activeDoc, setActiveDoc] = useState("NewDoc.md");
  const [markdown, setMarkdown] = useState("# Welcome to your Doc\nStart writing...");
  const [versionTimestamp, setVersionTimestamp] = useState("");
  const [toastOpen, setToastOpen] = useState(false);
  const [errorOpen, setErrorOpen] = useState(false);

  // Load document from localStorage when switching files
  useEffect(() => {
    const saved = localStorage.getItem(`doc_${activeDoc}`);
    if (saved) {
      setMarkdown(saved);
    } else {
      setMarkdown("# New document\nStart writing...");
    }
  }, [activeDoc]);

  /**
   * Saves the current document to localStorage.
   */
  const saveToLocal = async () => {
    try {
      localStorage.setItem(`doc_${activeDoc}`, markdown);
      const timestamp = new Date().toLocaleString();
      setVersionTimestamp(timestamp);
      setToastOpen(true);
    } catch (error) {
      setErrorOpen(true);
    }
  };

  const drawerWidth = 180;

  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      {/* Drawer */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            ml: 25,
            boxSizing: "border-box",
          },
        }}
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="h6">📁 File Tree</Typography>
          <Divider sx={{ my: 2 }} />
          <List>
            {["README.md", "DesignNotes.md", "Specs.md"].map((file) => (
              <ListItem key={file} disablePadding>
                <ListItemButton
                  onClick={() => setActiveDoc(file)}
                  selected={activeDoc === file}
                >
                  {file}
                </ListItemButton>
              </ListItem>
            ))}
            <ListItem disablePadding>
              <ListItemButton onClick={() => setActiveDoc("NewDoc.md")}>
                ➕ Create Doc
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
      </Drawer>

      {/* Main content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 4,
          display: "flex",
          gap: 4,
          ml: `${drawerWidth}px`,
        }}
      >
        {/* Editor */}
        <Box sx={{ flex: 1 }}>
          <Typography variant="h6">📝 Edit with Markdown</Typography>
          <TextField
            multiline
            fullWidth
            value={markdown}
            onChange={(e) => setMarkdown(e.target.value)}
            rows={20}
            variant="outlined"
          />
          <Box textAlign="right" mt={2}>
            <Button variant="contained" onClick={saveToLocal}>
              💾 Save
            </Button>
          </Box>
          {versionTimestamp && (
            <Typography variant="caption" color="text.secondary">
              Saved: {versionTimestamp}
            </Typography>
          )}
        </Box>

        {/* Preview */}
        <Box sx={{ flex: 1 }}>
          <Typography variant="h6">🔍 Preview</Typography>
          <Box
            sx={{
              border: "1px solid #ccc",
              borderRadius: 2,
              p: 2,
              bgcolor: "#f9f9f9",
              height: "100%",
              overflowY: "auto",
            }}
          >
            <ReactMarkdown>{markdown}</ReactMarkdown>
          </Box>
        </Box>
      </Box>

      {/* Snackbars */}
      <Snackbar
        open={toastOpen}
        autoHideDuration={3000}
        onClose={() => setToastOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity="success" variant="filled">
          Document saved successfully (localStorage).
        </Alert>
      </Snackbar>

      <Snackbar
        open={errorOpen}
        autoHideDuration={3000}
        onClose={() => setErrorOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity="error" variant="filled">
          Failed to save document. Please try again.
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ProjectDocumentation;
