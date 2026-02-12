/**
 * @fileoverview Input component.
 * Provides a reusable input field built on MUI's TextField.
 * Supports error handling, helper text, and dynamic input types.
 *
 * @module components/Input
 */

import React from 'react';
import PropTypes from 'prop-types';
import { TextField } from '@mui/material';

/**
 * Input Component
 *
 * @function Input
 * @param {Object} props - Component props.
 * @param {string} props.label - Label for the input field.
 * @param {string|number} props.value - Current value of the input.
 * @param {Function} props.onChange - Callback function triggered when the input value changes.
 * @param {boolean} [props.error=false] - Whether the input is in error state.
 * @param {string} [props.helperText] - Optional helper or error message displayed below the input.
 * @param {string} [props.type='text'] - Input type (e.g., `"text"`, `"password"`, `"email"`).
 * @returns {JSX.Element} A styled input field component.
 *
 * @example
 * <Input
 *   label="Email"
 *   value={email}
 *   onChange={(e) => setEmail(e.target.value)}
 *   error={!isValidEmail}
 *   helperText={!isValidEmail ? "Invalid email address" : ""}
 *   type="email"
 * />
 */
const Input = ({ label, value, onChange, error = false, helperText, type = 'text' }) => {
  return (
    <TextField
      label={label}
      value={value}
      onChange={onChange}
      error={error}
      helperText={helperText}
      fullWidth
      type={type}
      margin="normal"
      variant="outlined"
      aria-label={label}
      sx={{
        input: {
          color: 'text.primary',
          bgcolor: 'background.default',
        },
      }}
    />
  );
};

Input.propTypes = {
  /** Label for the input field */
  label: PropTypes.string.isRequired,
  /** Current value of the input */
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  /** Callback function triggered when the input value changes */
  onChange: PropTypes.func.isRequired,
  /** Whether the input is in error state */
  error: PropTypes.bool,
  /** Optional helper or error message displayed below the input */
  helperText: PropTypes.string,
  /** Input type (e.g., "text", "password", "email") */
  type: PropTypes.string,
};

export default Input;
