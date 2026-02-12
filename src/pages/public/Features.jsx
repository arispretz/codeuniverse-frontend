/**
 * @fileoverview Features page component.
 * Displays a grid of key platform features with icons, titles, and descriptions.
 * Focuses on task management (Kanban, local, personal), code editor,
 * and AI-powered code assistant.
 *
 * @module pages/public/Features
 */

import React from 'react';
import {
  Container,
  Typography,
  Card,
  CardContent,
  Avatar,
  Grid, 
} from '@mui/material';
import {
  ViewKanban,
  Assignment,
  SmartToy,
  Code,
} from '@mui/icons-material';

/**
 * Features configuration.
 * Each feature includes a title, description, and icon.
 *
 * @constant
 * @type {Array<{title: string, description: string, icon: JSX.Element}>}
 */
const features = [
  {
    title: 'Kanban Task Management',
    description:
      'Organize tasks visually with drag-and-drop Kanban boards. Track progress across statuses easily.',
    icon: <ViewKanban fontSize="large" />,
  },
  {
    title: 'Local & Personal Tasks',
    description:
      'Manage project-specific local tasks and keep track of personal to-dos with deadlines and priorities.',
    icon: <Assignment fontSize="large" />,
  },
  {
    title: 'Integrated Code Editor',
    description:
      'Write and edit code directly in the platform. Collaborate in real time with syntax highlighting.',
    icon: <Code fontSize="large" />,
  },
  {
    title: 'AI Code Assistant',
    description:
      'Generate, refactor, and explain code with natural language prompts. Boost productivity with smart suggestions.',
    icon: <SmartToy fontSize="large" />,
  },
];

/**
 * Features component.
 * Renders a responsive grid of platform features.
 *
 * @function Features
 * @returns {JSX.Element} Features page layout
 */
const Features = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Typography variant="h4" align="center" fontWeight="bold" gutterBottom>
        🚀 Key Features of the Platform
      </Typography>

      <Grid container spacing={4} sx={{ mt: 4 }}>
        {features.map((feature, index) => (
          <Grid key={index} item xs={12} sm={6} md={4}>
            <Card elevation={3} sx={{ height: '100%' }}>
              <CardContent>
                <Avatar
                  sx={{
                    bgcolor: 'primary.main',
                    width: 56,
                    height: 56,
                    mb: 2,
                  }}
                >
                  {feature.icon}
                </Avatar>
                <Typography variant="h6" gutterBottom>
                  {feature.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {feature.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Features;
