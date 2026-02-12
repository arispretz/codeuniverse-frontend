/**
 * @fileoverview Blog page component.
 * Showcases articles on productivity, AI, agile development, and product updates.
 * Renders a responsive grid of blog cards with images, categories, and summaries.
 *
 * @module pages/public/Blog
 */

import React from 'react';
import {
  Container,
  Typography,
  Card,
  CardContent,
  CardActionArea,
  useTheme,
  Box,
  Grid, 
} from '@mui/material';
import Blog1Img from '../../assets/images/Blog1.png';
import Blog2Img from '../../assets/images/Blog2.png';
import Blog3Img from '../../assets/images/Blog3.png';

/**
 * Articles configuration for the blog page.
 * Each article contains a title, category, summary, and image.
 *
 * @constant
 * @type {Array<{title: string, category: string, summary: string, image: string}>}
 */
const articles = [
  {
    title: 'Boosting Productivity with AI Tools',
    category: 'Productivity',
    summary:
      'Discover how integrating intelligent assistants streamlines coding and project workflows.',
    image: Blog1Img,
  },
  {
    title: 'Agile Development in Remote Teams',
    category: 'Agile Development',
    summary:
      'Best practices for keeping distributed dev squads aligned through sprints.',
    image: Blog2Img,
  },
  {
    title: 'Product Update: CodeUniverse v2.0',
    category: 'Product Updates',
    summary:
      'A deep dive into new features, performance improvements, and UI refinements.',
    image: Blog3Img,
  },
];

/**
 * Blog Component
 *
 * @function Blog
 * @returns {JSX.Element} Blog layout with article cards.
 *
 * @example
 * // Usage in routes
 * import Blog from './pages/Blog';
 *
 * <Route path="/blog" element={<Blog />} />
 */
const Blog = () => {
  const theme = useTheme();
  const textColor = theme.palette.text.primary;

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      {/* Page Title */}
      <Typography variant="h4" gutterBottom color={textColor}>
        📰 Blog
      </Typography>
      <Typography variant="body1" gutterBottom color={textColor}>
        Articles on productivity, AI, agile development, and product updates.
      </Typography>

      {/* Articles Grid */}
      <Grid container spacing={4} sx={{ mt: 4 }} aria-label="Blog articles">
        {articles.map((article, idx) => (
          <Grid key={idx} item xs={12} sm={6} md={4}>
            <Card>
              <CardActionArea>
                {/* Article Image */}
                <Box
                  sx={{
                    height: 160,
                    backgroundImage: `url(${article.image})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                  role="img"
                  aria-label={`Image for ${article.title}`}
                />
                {/* Article Content */}
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {article.title}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" gutterBottom>
                    {article.category}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {article.summary}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Blog;
