/**
 * @fileoverview Testimonials component.
 * Displays client testimonials with avatars, names, roles, and feedback text.
 *
 * @module pages/public/Testimonials
 */

import React from 'react';
import {
  Container,
  Typography,
  Card,
  Box,
  CardContent,
  useTheme,
  Avatar,
  Grid, 
} from '@mui/material';
import LucyImg from '../../assets/images/Lucy.png';
import CharlesImg from '../../assets/images/Charles.png';
import DanielImg from '../../assets/images/Daniel.png';

/**
 * Testimonials configuration.
 * Each testimonial includes a name, role, text, and image.
 */
const testimonials = [
  {
    name: 'Lucy P.',
    role: 'CTO at ByteFarm',
    text: 'Integrating chat, code review, and project management in one place transformed our team dynamics.\nWe spend less time searching—and more time creating.',
    image: LucyImg,
  },
  {
    name: 'Charles M.',
    role: 'Backend Lead at NovaTech',
    text: 'The code assistant helped us deliver faster. We use it in every review to optimize our scripts.',
    image: CharlesImg,
  },
  {
    name: 'Daniel R.',
    role: 'Fullstack Developer',
    text: 'As a freelancer, this platform gave me structure and saved me from using three different services.',
    image: DanielImg,
  },
];

/**
 * Testimonials component.
 * Renders a responsive grid of client testimonials.
 *
 * @function Testimonials
 * @returns {JSX.Element} Testimonials layout
 */
const Testimonials = () => {
  const theme = useTheme();
  const textColor = theme.palette.text.primary;

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Typography variant="h4" gutterBottom color={textColor}>
        Testimonials
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        Loved by devs, trusted by teams
      </Typography>

      <Grid container spacing={4} sx={{ mt: 2 }}>
        {testimonials.map(({ name, role, text, image }) => (
          <Grid key={name} size={{ xs: 12, sm: 6, md: 4 }}>
            <Card sx={{ height: '100%' }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                  <Avatar
                    src={image}
                    alt={name}
                    sx={{
                      width: 96,
                      height: 136,
                      objectFit: 'cover',
                      objectPosition: 'top',
                      border: '2px solid #ccc',
                    }}
                  />
                </Box>
                <Typography variant="body1" gutterBottom>
                  {text}
                </Typography>
                <Typography variant="subtitle2">{name}</Typography>
                <Typography variant="caption" color="text.secondary">
                  {role}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Testimonials;
