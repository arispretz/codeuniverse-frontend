/**
 * @fileoverview QuickStartGuide component.
 * Provides a step-by-step guide for new users to explore the platform.
 * Focuses on task management (Kanban, local, personal), code editor,
 * and AI-powered code assistant.
 *
 * @module pages/docs/QuickStartGuide
 */

import React from 'react';
import { Container, Typography, Box, Stepper, Step, StepLabel, Card, CardContent } from '@mui/material';

/**
 * Steps shown in the visual stepper.
 * Each string represents a core feature of the platform.
 *
 * @constant {string[]}
 */
const steps = [
  'Organize tasks with Kanban',
  'Manage local project tasks',
  'Track personal tasks',
  'Use the integrated code editor',
  'Boost productivity with the AI Code Assistant',
];

/**
 * Detailed descriptions for each step in the onboarding process.
 * Matches the order of the `steps` array.
 *
 * @constant {string[]}
 */
const stepDetails = [
  'Create and manage tasks visually with Kanban boards. Drag and drop tasks across statuses to stay on track.',
  'Handle project-specific tasks in local lists. Perfect for organizing work that belongs to a single project.',
  'Keep track of your personal to-dos outside of projects. Manage deadlines and priorities in one place.',
  'Write, edit, and collaborate on code directly in the built-in editor. Supports syntax highlighting and real-time updates.',
  'Use the AI-powered assistant to generate, refactor, and explain code. Save time and improve quality with smart suggestions.',
];

/**
 * QuickStartGuide component.
 * Renders a stepper and detailed cards to guide users through platform features.
 *
 * @function QuickStartGuide
 * @returns {JSX.Element} The rendered Quick Start Guide layout
 */
export function QuickStartGuide() {
  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        🧭 Quick Start Guide
      </Typography>
      <Typography variant="subtitle1" fontStyle="italic" gutterBottom>
        Welcome to your productivity platform—manage tasks, write code, and get AI-powered help.
      </Typography>

      {/* Visual Stepper */}
      <Box sx={{ mt: 4 }}>
        <Stepper orientation="vertical" activeStep={-1}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>

      {/* Step Details */}
      <Box sx={{ mt: 6 }}>
        {steps.map((title, index) => (
          <Card key={index} elevation={2} sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6">{`${index + 1}. ${title}`}</Typography>
              <Typography variant="body2" color="text.secondary">
                {stepDetails[index]}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Container>
  );
}

export default QuickStartGuide;
