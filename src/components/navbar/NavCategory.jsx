/**
 * @fileoverview NavCategory component.
 * Provides a navigation dropdown category for the top navigation bar.
 * Displays a button that reveals a menu of links when hovered.
 *
 * @module components/navbar/NavCategory
 */

import React, { useRef, useState } from 'react';
import { Button, Menu, MenuItem, Box } from '@mui/material';
import { Link } from 'react-router-dom';

/**
 * NavCategory Component
 *
 * @function NavCategory
 * @param {Object} props - Component props.
 * @param {string} props.label - Label for the dropdown button.
 * @param {Array<{label: string, to: string}>} props.items - Menu items with labels and routes.
 * @returns {JSX.Element} Dropdown navigation menu.
 *
 * @example
 * <NavCategory
 *   label="Resources"
 *   items={[
 *     { label: "Docs", to: "/docs" },
 *     { label: "API", to: "/api" }
 *   ]}
 * />
 */
const NavCategory = ({ label, items }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const buttonRef = useRef(null);

  /**
   * Opens the dropdown menu when mouse enters the button area.
   *
   * @function handleMouseEnter
   * @returns {void}
   */
  const handleMouseEnter = () => setAnchorEl(buttonRef.current);

  /**
   * Closes the dropdown menu when mouse leaves the button or menu area.
   *
   * @function handleMouseLeave
   * @returns {void}
   */
  const handleMouseLeave = () => setAnchorEl(null);

  return (
    <Box onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} role="presentation">
      <Button
        ref={buttonRef}
        color="inherit"
        aria-haspopup="true"
        aria-controls={`menu-${label}`}
        aria-expanded={Boolean(anchorEl)}
        sx={{
          textTransform: 'none',
          '&:hover': {
            color: '#71125daf',
            backgroundColor: '#e4e5eaff',
          },
        }}
      >
        {label}
      </Button>
      <Menu
        id={`menu-${label}`}
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMouseLeave}
        MenuListProps={{ onMouseLeave: handleMouseLeave }}
        PaperProps={{
          sx: {
            minWidth: buttonRef.current?.offsetWidth || 'auto',
          },
        }}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
      >
        {items.map(({ label: itemLabel, to }) => (
          <MenuItem
            key={itemLabel}
            component={Link}
            to={to}
            onClick={handleMouseLeave}
            aria-label={`Navigate to ${itemLabel}`}
          >
            {itemLabel}
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
};

export default NavCategory;
