/**
 * @fileoverview TeamChatModule component.
 * Provides a real-time chat interface for team collaboration.
 * Supports markdown formatting and online status indicators.
 *
 * @module pages/TeamChatModule
 */

import React, { useState } from "react";
import {
  Container,
  Typography,
  Box,
  TextField,
  IconButton,
  Paper,
  Avatar,
  List,
  ListItem,
  ListItemText,
  Chip,
  Divider,
  ListItemAvatar,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

/**
 * TeamChatModule component.
 * Renders a chat interface with markdown support and online status indicators.
 *
 * @function TeamChatModule
 * @returns {JSX.Element} Team chat module layout
 */
const TeamChatModule = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      user: "Camila",
      online: true,
      content: "Let’s review PR #42 in a few minutes.",
    },
    {
      id: 2,
      user: "Leo",
      online: false,
      content: "I’ve left my comments on the login handler.",
    },
  ]);
  const [input, setInput] = useState("");

  /**
   * Sends a new message and updates the message list.
   */
  const handleSend = () => {
    if (input.trim()) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          user: "You",
          online: true,
          content: input,
        },
      ]);
      setInput("");
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        💬 Team Chat Module
      </Typography>
      <Typography variant="subtitle1" color="text.secondary">
        <em>Talk it out. Stay in sync.</em> Chat instantly with teammates. Collaborate on code, solve blockers, and accelerate decision-making.
      </Typography>

      <Divider sx={{ my: 3 }} />

      <Paper elevation={3} sx={{ p: 2, maxHeight: 400, overflowY: "auto" }}>
        <List>
          {messages.map((msg) => (
            <ListItem alignItems="flex-start" key={msg.id}>
              <ListItemAvatar>
                <Avatar>{msg.user[0]}</Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Box display="flex" alignItems="center" gap={1}>
                    <Typography fontWeight="bold">{msg.user}</Typography>
                    {msg.online && (
                      <Chip
                        icon={
                          <FiberManualRecordIcon color="success" sx={{ fontSize: 14 }} />
                        }
                        label="Online"
                        size="small"
                        color="success"
                      />
                    )}
                  </Box>
                }
                secondary={
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {msg.content}
                    </ReactMarkdown>
                  </Typography>
                }
              />
            </ListItem>
          ))}
        </List>
      </Paper>

      <Box sx={{ display: "flex", mt: 2 }}>
        <TextField
          fullWidth
          placeholder="Write a message (Markdown supported)"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          multiline
          minRows={2}
        />
        <IconButton onClick={handleSend} color="primary" sx={{ ml: 1 }}>
          <SendIcon />
        </IconButton>
      </Box>
    </Container>
  );
};

export default TeamChatModule;
