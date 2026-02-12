/**
 * @fileoverview ForDevelopers page component.
 * Highlights platform features, provides a visual overview, and showcases developer testimonials.
 *
 * @module pages/public/ForDevelopers
 */

import React from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  Grid, 
} from '@mui/material';
import { useKeenSlider } from 'keen-slider/react';
import 'keen-slider/keen-slider.min.css';
import KanbanImg from '../../assets/images/kanban-board.png';
import AssistantImg from '../../assets/images/ai_assistant.png';
import EditorImg from '../../assets/images/code-editor.png';
import ChatImg from '../../assets/images/chat.png';

/**
 * Features configuration.
 * Each feature highlights a key capability of the platform.
 *
 * @constant
 * @type {string[]}
 */
const features = [
  'Integrated Code Editor + AI assistant',
  'Code evaluation',
  'Instant reviews and feedback',
  'Real-time chat',
];

/**
 * Developer testimonials showcasing user experiences.
 *
 * @constant
 * @type {Array<{name: string, role: string, quote: string}>}
 */
const testimonials = [
  {
    name: 'Maria G.',
    role: 'Full Stack Developer',
    quote:
      'The code assistant saves me hours every week. It’s like having a pair programmer 24/7.',
  },
  {
    name: 'Leo R.',
    role: 'CTO',
    quote:
      'I integrated our entire workflow without friction. Productivity skyrocketed.',
  },
  {
    name: 'Elena T.',
    role: 'Junior Dev',
    quote:
      'Onboarding was instant. I’m already collaborating in real time with my team.',
  },
];

/**
 * Defines the images that will be rendered
 * in the "Visual Overview" section.
 *
 * @constant
 * @type {Array<{src: string, alt: string}>}
 */
const screenshots = [
  { src: KanbanImg, alt: 'Kanban Board' },
  { src: AssistantImg, alt: 'AI Assistant' },
  { src: EditorImg, alt: 'Code Editor' },
  { src: ChatImg, alt: 'Team Chat' },
];

/**
 * ForDevelopers component.
 * Renders feature highlights, testimonials, and a call-to-action.
 *
 * @function ForDevelopers
 * @returns {JSX.Element} ForDevelopers page layout
 */
const ForDevelopers = () => {
  const sliderConfig = {
    loop: true,
    slides: {
      perView: 1,
      spacing: 10,
    },
  };

  const [sliderRef] = useKeenSlider(sliderConfig);

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Typography variant="h4" fontWeight="bold" align="center" gutterBottom>
        “Spend less time managing tasks, more time writing great code.”
      </Typography>

      {/* Feature Highlights */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" gutterBottom>
          🔍 Feature Highlights:
        </Typography>
        <Grid container spacing={2}>
          {features.map((feature, index) => (
            <Grid key={index} item xs={12} sm={6} md={4}>
              <Card elevation={2}>
                <CardContent>
                  <Typography variant="body1">• {feature}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Visual Overview */}
      <Box sx={{ mt: 6 }}>
        <Typography variant="h6" gutterBottom>
          👁️ Visual Overview:
        </Typography>
        <Grid container spacing={2}>
          {screenshots.map((shot, i) => (
            <Grid item xs={12} sm={6} md={3} key={i}>
              <img
                src={shot.src}
                alt={shot.alt}
                style={{
                  width: '100%',
                  borderRadius: 8,
                  boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                }}
              />
              <Typography variant="caption" display="block" align="center">
                {shot.alt}
              </Typography>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Testimonials */}
      <Box sx={{ mt: 6 }}>
        <Typography variant="h6" gutterBottom>
          💬 What Developers Are Saying:
        </Typography>
        <div ref={sliderRef} className="keen-slider">
          {testimonials.map((t, idx) => (
            <div key={idx} className="keen-slider__slide">
              <Card sx={{ p: 3 }}>
                <Typography variant="body1" fontStyle="italic" gutterBottom>
                  “{t.quote}”
                </Typography>
                <Typography variant="subtitle2">
                  — {t.name}, {t.role}
                </Typography>
              </Card>
            </div>
          ))}
        </div>
      </Box>

      {/* Call to Action */}
      <Box textAlign="center" sx={{ mt: 6 }}>
        <Button variant="contained" size="large" color="primary">
          👉 Get started now—build your project smarter
        </Button>
      </Box>
    </Container>
  );
};

export default ForDevelopers;
