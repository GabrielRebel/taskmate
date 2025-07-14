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
const { validateChatMessage } = require('../middleware/validation');

// Initialize multi-provider AI service (CHAT-01: GPT-4 level conversation)
const AIProviderService = require('../services/ai-provider');
const aiService = new AIProviderService();

// POST /message: Handle user chat message and return AI response
router.post('/message', validateChatMessage, async (req, res) => {
  try {
    const { message, chatHistory = [] } = req.body;

    // Prepare conversation context for OpenAI
    const messages = [
      {
        role: 'system',
        content: `You are TaskMate, an AI co-pilot for mission-driven productivity. 
        Your role is to have natural conversations while being aware that task extraction 
        happens separately (TASK-02 component). Focus on being helpful and engaging.
        
        Key behaviors:
        - Be conversational and supportive
        - Don't try to extract tasks yourself (that's handled by TASK-02)
        - If users mention tasks/deadlines, acknowledge them naturally
        - Keep responses concise but helpful`
      },
      ...chatHistory.map(msg => ({
        role: msg.role,
        content: msg.content
      })),
      {
        role: 'user',
        content: message
      }
    ];

    // Get response from AI provider
    const aiResponse = await aiService.getChatResponse(message, chatHistory, 'conversation');

    // CHAT-01 Atomic Scope: Only return the response, don't modify anything else
    res.json({
      success: true,
      data: {
        response: aiResponse,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to process message',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Internal error'
    });
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
  const status = aiService.getProviderStatus();
  res.json({
    success: true,
    providers: status,
    message: status.available ? 'AI providers available' : 'No AI providers configured'
  });
});

module.exports = router; 