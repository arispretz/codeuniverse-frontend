/**
 * @fileoverview AIAssistant showcase page.
 * Displays prompt examples with before/after code snippets and a list of supported languages
 * for AI-powered code generation.
 *
 * @module pages/public/AIAssistant
 */

import React from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  Chip,
  useTheme,
  Divider,
  Tooltip,
  Grid, 
} from "@mui/material";

/**
 * Example prompts with before/after code snippets.
 * Each example demonstrates how the AI Assistant improves or generates code.
 *
 * @constant
 * @type {Array<{prompt: string, before: string, after: string}>}
 */
const examples = [
  {
    prompt: "Create an Express login route with JWT.",
    before: `app.post("/login", async (req, res) => { /* legacy code */ });`,
    after: `app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !user.comparePassword(password)) return res.status(401).send("Unauthorized");
  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
  res.json({ token });
});`,
  },
  {
    prompt: "Fix this async bug in Python.",
    before: `def fetch_data():\n    data = await get_data()\n    return data`,
    after: `async def fetch_data():\n    data = await get_data()\n    return data`,
  },
];

/**
 * List of supported programming languages for AI code generation.
 *
 * @constant
 * @type {string[]}
 */
const supportedLanguages = [
  "JavaScript",
  "Python",
  "TypeScript",
  "Go",
  "Rust",
  "Java",
  "C#",
  "Shell",
  "HTML/CSS",
];

/**
 * AIAssistant Component
 *
 * @function AIAssistant
 * @returns {JSX.Element} Assistant demo layout with examples and supported languages.
 *
 * @example
 * // Usage in routes
 * import AIAssistant from "./pages/AIAssistant";
 *
 * <Route path="/ai-assistant" element={<AIAssistant />} />
 */
const AIAssistant = () => {
  const theme = useTheme();
  const textColor = theme.palette.text.primary;

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      {/* Page Title */}
      <Typography variant="h4" gutterBottom color={textColor}>
        🤖 AI Assistant
      </Typography>
      <Typography variant="h6" gutterBottom color={textColor}>
        “It’s like pair programming—with a superintelligent dev partner.”
      </Typography>
      <Typography variant="body1" gutterBottom color={textColor}>
        Ask in plain language. Get secure, optimized code—instantly.
      </Typography>

      <Divider sx={{ my: 4 }} />

      {/* Examples Section */}
      <Grid container spacing={4}>
        {examples.map(({ prompt, before, after }, idx) => (
          <Grid key={idx} item xs={12} md={6}>
            <Typography variant="subtitle1" gutterBottom color="text.secondary">
              🧠 Prompt: <strong>{prompt}</strong>
            </Typography>

            {/* Before Code */}
            <Box
              component={Paper}
              variant="outlined"
              sx={{ p: 2, mb: 2, bgcolor: "background.paper" }}
            >
              <Tooltip title="Original code">
                <Typography variant="caption" color="text.secondary">
                  Before
                </Typography>
              </Tooltip>
              <pre style={{ fontSize: "0.85rem", marginTop: 4 }}>{before}</pre>
            </Box>

            {/* After Code */}
            <Box
              component={Paper}
              variant="outlined"
              sx={{ p: 2, bgcolor: "background.default" }}
            >
              <Tooltip title="Optimized code from AI">
                <Typography variant="caption" color="text.secondary">
                  After
                </Typography>
              </Tooltip>
              <pre style={{ fontSize: "0.85rem", marginTop: 4 }}>{after}</pre>
            </Box>
          </Grid>
        ))}
      </Grid>

      <Divider sx={{ my: 6 }} />

      {/* Supported Languages Section */}
      <Typography variant="h6" gutterBottom color={textColor}>
        🧪 Supported Languages
      </Typography>

      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }} aria-label="Supported languages">
        {supportedLanguages.map((lang, i) => (
          <Chip key={i} label={lang} color="primary" variant="outlined" />
        ))}
      </Box>
    </Container>
  );
};

export default AIAssistant;
