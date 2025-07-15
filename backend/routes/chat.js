/*
 * Chat Route (CHAT-01)
 * Purpose: Handles AI-powered chat interface for TaskMate.
 * Atomic Scope: Only renders messages, never modifies chat history or tasks.
 * Key Behaviors:
 *   - Uses multi-provider AI service (OpenAI, Claude, DeepSeek)
 *   - Responds to user messages in a conversational, supportive way
 *   - Does not extract or modify tasks (handled by TASK-02)
 */
const express = require('express');
const router = express.Router();
const { validateFields } = require('../middleware/validation');
const { getAIResponse } = require('../services/ai-provider');

// POST /api/chat/message
router.post('/message', validateFields(['message']), async (req, res) => {
  const { message } = req.body;
  try {
    const aiResult = await getAIResponse(message);
    res.json({ data: aiResult });
  } catch (error) {
    res.status(500).json({ error: 'AI provider error', details: error.message });
  }
});

// GET /history: Return chat history (currently empty, managed by frontend)
router.get('/history', (req, res) => {
  // CHAT-01 Atomic Scope: This would typically fetch from database
  // For now, return empty array (chat history managed by frontend)
  res.json({
    success: true,
    history: []
  });
});

// GET /providers: Return status of available AI providers
router.get('/providers', (req, res) => {
  const status = require('../services/ai-provider').getProviderStatus();
  res.json({
    success: true,
    providers: status,
    message: status.available ? 'AI providers available' : 'No AI providers configured'
  });
});

module.exports = router; 