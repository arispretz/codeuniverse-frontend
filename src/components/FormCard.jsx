/**
 * @fileoverview FormCard component.
 * Provides a reusable card layout for form sections with a title, optional subtitle,
 * content area, and optional footer (e.g., buttons or actions).
 *
 * @module components/FormCard
 */

import React from "react";
import { Card, CardContent, Typography, Box } from "@mui/material";

/**
 * FormCard Component
 *
 * @function FormCard
 * @param {Object} props - Component props.
 * @param {string} props.title - Title of the card.
 * @param {string} [props.subtitle] - Optional subtitle displayed below the title.
 * @param {JSX.Element|JSX.Element[]} props.children - Content of the card (form fields or other elements).
 * @param {JSX.Element} [props.footer] - Optional footer section (e.g., buttons or actions).
 * @returns {JSX.Element} A styled card component for form sections.
 *
 * @example
 * <FormCard
 *   title="User Information"
 *   subtitle="Please fill out the fields below"
 *   footer={<Button variant="contained">Submit</Button>}
 * >
 *   <TextField label="Name" fullWidth />
 *   <TextField label="Email" fullWidth />
 * </FormCard>
 */
const FormCard = ({ title, subtitle, children, footer }) => {
  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        {/* Title */}
        <Typography variant="h6">{title}</Typography>

        {/* Subtitle */}
        {subtitle && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {subtitle}
          </Typography>
        )}

        {/* Content */}
        <Box sx={{ mb: 2 }}>{children}</Box>

        {/* Footer */}
        {footer && <Box>{footer}</Box>}
      </CardContent>
    </Card>
  );
};

export default FormCard;
