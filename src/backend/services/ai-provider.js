const OpenAI = require('openai');
const Anthropic = require('@anthropic-ai/sdk');

class AIProviderService {
  constructor() {
    this.providers = {
      openai: null,
      claude: null,
      deepseek: null
    };
    
    this.initializeProviders();
  }

  initializeProviders() {
    // Initialize OpenAI
    if (process.env.OPENAI_API_KEY) {
      this.providers.openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });
    }

    // Initialize Claude
    if (process.env.ANTHROPIC_API_KEY) {
      this.providers.claude = new Anthropic({
        apiKey: process.env.ANTHROPIC_API_KEY,
      });
    }

    // Initialize DeepSeek (using OpenAI SDK with DeepSeek endpoint)
    if (process.env.DEEPSEEK_API_KEY) {
      this.providers.deepseek = new OpenAI({
        apiKey: process.env.DEEPSEEK_API_KEY,
        baseURL: 'https://api.deepseek.com/v1',
      });
    }
  }

  async getChatResponse(message, chatHistory = [], useCase = 'conversation') {
    const provider = this.selectProvider(useCase);
    
    try {
      switch (provider) {
        case 'openai':
          return await this.openaiChat(message, chatHistory);
        case 'claude':
          return await this.claudeChat(message, chatHistory);
        case 'deepseek':
          return await this.deepseekChat(message, chatHistory);
        default:
          throw new Error('No available AI provider');
      }
    } catch (error) {
      console.error(`Error with ${provider}:`, error);
      return await this.fallbackResponse(message, chatHistory);
    }
  }

  selectProvider(useCase) {
    // Provider selection logic based on use case and availability
    const availableProviders = Object.keys(this.providers).filter(
      key => this.providers[key] !== null
    );

    if (availableProviders.length === 0) {
      throw new Error('No AI providers configured');
    }

    // Check for preferred provider from environment
    const preferredProvider = process.env.PREFERRED_PROVIDER;
    if (preferredProvider && availableProviders.includes(preferredProvider)) {
      return preferredProvider;
    }

    switch (useCase) {
      case 'conversation':
        // Prefer DeepSeek for natural conversation (cost-effective)
        return availableProviders.includes('deepseek') ? 'deepseek' : 
               availableProviders.includes('openai') ? 'openai' : availableProviders[0];
      
      case 'task_extraction':
        // Prefer Claude for structured task extraction
        return availableProviders.includes('claude') ? 'claude' : 
               availableProviders.includes('deepseek') ? 'deepseek' : availableProviders[0];
      
      case 'notification':
        // Prefer DeepSeek for cost-effective notifications
        return availableProviders.includes('deepseek') ? 'deepseek' : availableProviders[0];
      
      default:
        return availableProviders[0];
    }
  }

  async openaiChat(message, chatHistory) {
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

    const completion = await this.providers.openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4',
      messages: messages,
      max_tokens: 500,
      temperature: 0.7,
    });

    return completion.choices[0].message.content;
  }

  async claudeChat(message, chatHistory) {
    const messages = [
      {
        role: 'user',
        content: `You are TaskMate, an AI co-pilot for mission-driven productivity. 
        Have a natural conversation with the user. Be helpful and engaging.
        
        Previous conversation:
        ${chatHistory.map(msg => `${msg.role}: ${msg.content}`).join('\n')}
        
        User: ${message}`
      }
    ];

    const response = await this.providers.claude.messages.create({
      model: 'claude-3-sonnet-20240229',
      max_tokens: 500,
      messages: messages,
    });

    return response.content[0].text;
  }

  async deepseekChat(message, chatHistory) {
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

    const completion = await this.providers.deepseek.chat.completions.create({
      model: 'deepseek-chat',
      messages: messages,
      max_tokens: 500,
      temperature: 0.7,
    });

    return completion.choices[0].message.content;
  }

  async fallbackResponse(message, chatHistory) {
    // Simple fallback response when all providers fail
    return `I'm having trouble connecting to my AI services right now. I've noted your message: "${message}". Please try again in a moment, or check your internet connection.`;
  }

  async extractTasks(message) {
    // Use DeepSeek for task extraction (cost-effective and capable)
    const provider = this.selectProvider('task_extraction');
    
    const taskExtractionPrompt = `
    Extract tasks and deadlines from this message. Return only a JSON array of tasks:
    [
      {
        "title": "task description",
        "deadline": "YYYY-MM-DD HH:MM" or null,
        "priority": "high|medium|low"
      }
    ]
    
    Message: "${message}"
    `;

    try {
      let response;
      if (provider === 'claude') {
        const claudeResponse = await this.providers.claude.messages.create({
          model: 'claude-3-sonnet-20240229',
          max_tokens: 300,
          messages: [{ role: 'user', content: taskExtractionPrompt }],
        });
        response = claudeResponse.content[0].text;
      } else if (provider === 'deepseek') {
        const deepseekResponse = await this.providers.deepseek.chat.completions.create({
          model: 'deepseek-chat',
          messages: [{ role: 'user', content: taskExtractionPrompt }],
          max_tokens: 300,
          temperature: 0.1,
        });
        response = deepseekResponse.choices[0].message.content;
      } else {
        const openaiResponse = await this.providers.openai.chat.completions.create({
          model: 'gpt-4',
          messages: [{ role: 'user', content: taskExtractionPrompt }],
          max_tokens: 300,
          temperature: 0.1,
        });
        response = openaiResponse.choices[0].message.content;
      }

      // Parse JSON response
      const tasks = JSON.parse(response);
      return Array.isArray(tasks) ? tasks : [];
    } catch (error) {
      console.error('Task extraction error:', error);
      return [];
    }
  }

  getProviderStatus() {
    return {
      openai: this.providers.openai !== null,
      claude: this.providers.claude !== null,
      deepseek: this.providers.deepseek !== null,
      available: Object.values(this.providers).some(p => p !== null)
    };
  }
}

module.exports = AIProviderService; 