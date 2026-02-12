/**
 * @fileoverview TermsOfService component.
 * Displays the platform's legal terms and conditions for compliance and user visibility.
 *
 * @module pages/public/TermsOfService
 */

import React from 'react';
import { Container, Typography, Box, useTheme } from '@mui/material';

/**
 * TermsOfService component.
 * Renders structured sections of the platform's terms and conditions.
 *
 * @function TermsOfService
 * @returns {JSX.Element} Terms of service layout
 */
const TermsOfService = () => {
  const theme = useTheme();
  const textColor = theme.palette.text.primary;

  /**
   * Terms and conditions sections.
   * Each section contains a title and content description.
   */
  const terms = [
    {
      title: '1. Use of Service',
      content:
        'You may use the platform for personal or professional programming-related activities. You agree not to misuse the service or disrupt its availability.',
    },
    {
      title: '2. Accounts',
      content:
        "You're responsible for maintaining the confidentiality of your login credentials. Notify us immediately if you suspect unauthorized access.",
    },
    {
      title: '3. Intellectual Property',
      content:
        'All platform content, features, and technologies are the property of [Your Company Name]. You retain ownership of the code and data you create.',
    },
    {
      title: '4. API Integrations and Limitations',
      content:
        'You may access third-party APIs under their respective terms. We are not responsible for downtime or data loss from external services.',
    },
    {
      title: '5. Termination',
      content:
        'We may suspend or terminate accounts that violate our terms or abuse system resources.',
    },
    {
      title: '6. Limitation of Liability',
      content:
        'Our platform is provided "as is". We are not liable for indirect or consequential damages arising from its use.',
    },
    {
      title: '7. Modifications',
      content:
        'We may update these terms periodically. Continued use implies acceptance of the revised terms.',
    },
  ];

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Typography variant="h4" gutterBottom color={textColor}>
        Terms and Conditions
      </Typography>

      <Typography variant="subtitle2" gutterBottom color={textColor}>
        <strong>Effective Date:</strong> [Insert Date] &nbsp;&nbsp;
        <strong>Last Updated:</strong> [Insert Date]
      </Typography>

      <Typography paragraph color={textColor}>
        Welcome to codeuniverse! By accessing or using our service, you agree to these Terms and Conditions.
      </Typography>

      {terms.map(({ title, content }) => (
        <Box key={title} sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom color={textColor}>
            {title}
          </Typography>
          <Typography variant="body1" color={textColor}>
            • {content}
          </Typography>
        </Box>
      ))}
    </Container>
  );
};

export default TermsOfService;
