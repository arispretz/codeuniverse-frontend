/**
 * @fileoverview Help Center component with sidebar navigation and collapsible content.
 * Allows users to explore help topics interactively.
 *
 * @module pages/public//HelpCenter
 */

import React, { useState } from 'react';
import {
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  Typography,
  Collapse,
  Container,
  Toolbar,
} from '@mui/material';
import { ExpandLess, ExpandMore } from '@mui/icons-material';

const drawerWidth = 240;

/**
 * Help sections configuration.
 * Each section contains a title and content description.
 */
const helpSections = [
  {
    title: 'Getting Started',
    content:
      'Learn how to set up your account, create your first workspace, and invite collaborators.',
  },
  {
    title: 'Code Assistant Guide',
    content:
      'Master the AI assistant: prompts, suggestions, usage credits, and tips.',
  },
];

/**
 * HelpCenter component.
 * Renders a sidebar with collapsible help topics and main content area.
 *
 * @function HelpCenter
 * @returns {JSX.Element} Help center layout
 */
function HelpCenter() {
  const [openIndex, setOpenIndex] = useState(null);

  /**
   * Handles click events on help section items.
   * Toggles the collapse state of the selected section.
   *
   * @param {number} index - Index of the clicked section
   */
  const handleClick = (index) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <>
      <Toolbar />
      <Box sx={{ display: 'flex', minHeight: '80vh' }}>
        <Drawer
          variant="permanent"
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            zIndex: (theme) => theme.zIndex.appBar - 1,
            [`& .MuiDrawer-paper`]: {
              width: drawerWidth,
              boxSizing: 'border-box',
            },
          }}
        >
          <Box sx={{ px: 2 }}>
            <Toolbar />
            <Typography
              variant="h6"
              fontWeight="bold"
              textAlign="center"
              sx={{ mb: 2 }}
            >
              Help Center
            </Typography>
            <List aria-label="Help topics">
              {helpSections.map((section, index) => (
                <ListItemButton
                  key={index}
                  onClick={() => handleClick(index)}
                  aria-expanded={openIndex === index}
                  aria-controls={`section-${index}`}
                >
                  <ListItemText primary={section.title} />
                  {openIndex === index ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
              ))}
            </List>
          </Box>
        </Drawer>

        <Box
          component="main"
          sx={{ flexGrow: 1, pl: 3, ml: `${drawerWidth}px` }}
        >
          <Toolbar />
          <Container maxWidth="md" sx={{ py: 6 }}>
            {helpSections.map((section, index) => (
              <Collapse
                in={openIndex === index}
                timeout="auto"
                unmountOnExit
                key={index}
                id={`section-${index}`}
              >
                <Typography variant="h5" gutterBottom>
                  {section.title}
                </Typography>
                <Typography variant="body1" color="text.secondary" paragraph>
                  {section.content}
                </Typography>
                <Box sx={{ mb: 4 }} />
              </Collapse>
            ))}
            <Typography variant="body2" color="text.secondary" sx={{ mt: 4 }}>
              Browse Guides | Integrate Tools | Ask the Assistant
            </Typography>
          </Container>
        </Box>
      </Box>
    </>
  );
}

export default HelpCenter;
