/**
 * @fileoverview ContactSupport component.
 * Provides a contact and support form for user inquiries.
 * Allows users to send messages or reach support via email.
 *
 * @module pages/public/ContactSupport
 */

import React, { useState } from 'react';
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  useTheme,
} from '@mui/material';

/**
 * ContactSupport Component
 *
 * @function ContactSupport
 * @returns {JSX.Element} Contact form layout with fields for name, email, and message.
 *
 * @example
 * // Usage in routes
 * import ContactSupport from './pages/ContactSupport';
 *
 * <Route path="/contact-support" element={<ContactSupport />} />
 */
const ContactSupport = () => {
  const theme = useTheme();
  const textColor = theme.palette.text.primary;

  // Local state for form fields
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  /**
   * Handles input changes in the form fields.
   *
   * @function handleChange
   * @param {React.ChangeEvent<HTMLInputElement>} e - Input change event
   */
  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  /**
   * Handles form submission.
   * Logs form data and sets submission state.
   * In a real-world scenario, integrate with backend (e.g., POST request, Formspree, EmailJS).
   *
   * @function handleSubmit
   * @param {React.FormEvent<HTMLFormElement>} e - Form submit event
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', form);
    setSubmitted(true);
  };

  return (
    <Container maxWidth="sm" sx={{ py: 6 }}>
      {/* Page Title */}
      <Typography variant="h4" gutterBottom color={textColor}>
        Contact & Support
      </Typography>

      {/* Introductory Text */}
      <Typography variant="body1" gutterBottom color={textColor}>
        If you have any questions or need help, feel free to reach out.
        You can send us a message using the form below or email us directly at:
      </Typography>

      {/* Support Email */}
      <Typography variant="body1" sx={{ mb: 4 }} color={textColor}>
        <strong>Email:</strong> support@codeuniverse-demo.com
      </Typography>

      {/* Contact Form */}
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
        aria-label="Contact support form"
      >
        <TextField
          required
          label="Name"
          name="name"
          value={form.name}
          onChange={handleChange}
          autoComplete="name"
        />
        <TextField
          required
          label="Email"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          autoComplete="email"
        />
        <TextField
          required
          label="Message"
          name="message"
          multiline
          rows={4}
          value={form.message}
          onChange={handleChange}
        />
        <Button type="submit" variant="contained" color="primary">
          Send Message
        </Button>

        {/* Success Message */}
        {submitted && (
          <Typography variant="body2" color="success.main">
            ✅ Message sent successfully!
          </Typography>
        )}
      </Box>
    </Container>
  );
};

export default ContactSupport;
