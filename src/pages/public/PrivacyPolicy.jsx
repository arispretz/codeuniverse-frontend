/**
 * @fileoverview PrivacyPolicy component.
 * Displays the platform's privacy policy including data collection, usage, rights, and contact information.
 *
 * @module pages/public/PrivacyPolicy
 */

import React from 'react';
import { Container, Typography, Box, useTheme } from '@mui/material';

/**
 * PrivacyPolicy component.
 * Renders structured sections of the privacy policy.
 *
 * @function PrivacyPolicy
 * @returns {JSX.Element} Privacy policy layout
 */
const PrivacyPolicy = () => {
  const theme = useTheme();
  const textColor = theme.palette.text.primary;

  /**
   * Sections of the privacy policy.
   * Each section contains a title and a list of content items.
   */
  const sections = [
    {
      title: '1. Information We Collect',
      content: [
        'Personal data: name, email, company, and user credentials.',
        'Usage data: task activity, code snippets, messages, analytics.',
        'Device data: browser type, IP address, operating system.',
      ],
    },
    {
      title: '2. How We Use Your Information',
      content: [
        'To provide and improve platform functionality.',
        'To personalize user experience.',
        'For customer support and account management.',
        'For analytical and security purposes.',
      ],
    },
    {
      title: '3. Third-Party Integrations',
      content: [
        'We connect with services like GitHub, GitLab, Trello, Firebase, and Jitsi.',
        'These may collect additional data—please refer to their respective policies.',
      ],
    },
    {
      title: '4. Cookies',
      content: [
        'We use cookies for performance, analytics, and security.',
        'You can manage cookie preferences in your browser.',
      ],
    },
    {
      title: '5. Data Security',
      content: [
        'We follow industry standards to protect your data, including encryption, secure login systems, and continuous monitoring.',
      ],
    },
    {
      title: '6. Your Rights',
      content: [
        'Request data access or deletion.',
        'Update or correct personal information.',
        'Withdraw consent at any time.',
      ],
    },
    {
      title: '7. Contact Us',
      content: [
        'If you have any concerns, contact us at: support@yourdomain.com',
      ],
    },
  ];

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Typography variant="h4" gutterBottom color={textColor}>
        Privacy Policy
      </Typography>

      <Typography variant="subtitle2" gutterBottom color={textColor}>
        <strong>Effective Date:</strong> [Insert Date] &nbsp;&nbsp;
        <strong>Last Updated:</strong> [Insert Date]
      </Typography>

      <Typography paragraph color={textColor}>
        At [Your Platform Name], we take your privacy seriously. This policy outlines how we collect, use, and protect your information when you use our services.
      </Typography>

      {sections.map(({ title, content }) => (
        <Box key={title} sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom color={textColor}>
            {title}
          </Typography>
          {content.map((item, idx) => (
            <Typography key={idx} variant="body1" color={textColor}>
              • {item}
            </Typography>
          ))}
        </Box>
      ))}
    </Container>
  );
};

export default PrivacyPolicy;
