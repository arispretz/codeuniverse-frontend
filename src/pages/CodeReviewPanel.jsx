/**
 * @fileoverview CodeReviewPanel component.
 * Provides a code review interface with diff visualization, inline comments,
 * approval actions, and a chat sidebar for team collaboration.
 *
 * @module pages/CodeReviewPanel
 */

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Chip,
  TextField,
  Button,
  Avatar,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';

import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';

/**
 * Mock diff data for demonstration purposes.
 */
const mockDiff = [
  { line: 1, old: '', new: 'function greet(name) {' },
  { line: 2, old: '', new: '  return `Hello ${name}`;' },
  { line: 3, old: '', new: '}' },
];

/**
 * CodeReviewPanel component.
 * Renders a code diff section with inline comments, approval actions,
 * and a chat sidebar for collaborative review.
 *
 * @function CodeReviewPanel
 * @returns {JSX.Element} Code review interface
 */
const CodeReviewPanel = () => {
  const [comments, setComments] = useState({});
  const [chatMessages, setChatMessages] = useState([]);
  const [newChat, setNewChat] = useState('');
  const [approvalStatus, setApprovalStatus] = useState(null); // "approved" | "changes"

  /**
   * Handles comment changes for a specific line in the diff.
   * @param {number} line - Line number of the code diff
   * @param {string} text - Comment text
   */
  const handleCommentChange = (line, text) => {
    setComments((prev) => ({ ...prev, [line]: text }));
  };

  /**
   * Sends a new chat message to the chat sidebar.
   */
  const handleSendChat = () => {
    if (newChat.trim()) {
      setChatMessages((prev) => [...prev, { user: 'You', message: newChat.trim() }]);
      setNewChat('');
    }
  };

  return (
    <Box sx={{ display: 'flex', gap: 2 }}>
      {/* Code Diff Section */}
      <Box sx={{ flex: 3 }}>
        <Typography variant="h5" gutterBottom>
          Review smarter. Ship faster.
        </Typography>
        <Paper variant="outlined" sx={{ p: 2 }}>
          {mockDiff.map(({ line, old, new: newCode }, i) => (
            <Box key={i} sx={{ mb: 2 }}>
              <Typography sx={{ fontFamily: 'monospace', whiteSpace: 'pre-wrap' }}>
                <span style={{ color: 'gray' }}>Line {line}: </span>
                {old && (
                  <span style={{ textDecoration: 'line-through', color: 'red' }}>{old}</span>
                )}
                {newCode && <span style={{ color: 'green' }}>{newCode}</span>}
              </Typography>
              <TextField
                label="Comment"
                fullWidth
                variant="outlined"
                size="small"
                value={comments[line] || ''}
                onChange={(e) => handleCommentChange(line, e.target.value)}
                sx={{ mt: 1 }}
                aria-label={`Comment for line ${line}`}
              />
            </Box>
          ))}
        </Paper>

        {/* Approval Actions */}
        <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
          <Button
            variant="contained"
            color="success"
            startIcon={<CheckIcon />}
            onClick={() => setApprovalStatus('approved')}
          >
            Approve
          </Button>
          <Button
            variant="outlined"
            color="error"
            startIcon={<CloseIcon />}
            onClick={() => setApprovalStatus('changes')}
          >
            Request Changes
          </Button>
          {approvalStatus && (
            <Chip
              label={approvalStatus === 'approved' ? '✅ Approved' : '❌ Changes Required'}
              color={approvalStatus === 'approved' ? 'success' : 'error'}
              sx={{ ml: 2 }}
            />
          )}
        </Box>
      </Box>

      {/* Chat Sidebar */}
      <Box sx={{ flex: 1 }}>
        <Typography variant="h6" gutterBottom>
          <ChatBubbleOutlineIcon sx={{ mr: 1 }} />
          Chat
        </Typography>
        <Paper variant="outlined" sx={{ p: 2, height: 500, overflowY: 'auto' }}>
          <List aria-label="Chat messages">
            {chatMessages.map((msg, i) => (
              <ListItem key={i} alignItems="flex-start">
                <Avatar sx={{ mr: 2 }}>{msg.user[0]}</Avatar>
                <ListItemText primary={msg.user} secondary={msg.message} />
              </ListItem>
            ))}
          </List>
        </Paper>
        <TextField
          label="Type a message"
          fullWidth
          variant="outlined"
          value={newChat}
          onChange={(e) => setNewChat(e.target.value)}
          sx={{ mt: 2 }}
          aria-label="New chat message"
        />
        <Button variant="contained" fullWidth sx={{ mt: 1 }} onClick={handleSendChat}>
          Send
        </Button>
      </Box>
    </Box>
  );
};

export default CodeReviewPanel;
