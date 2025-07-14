# TaskMate DeepSeek Setup Guide

## 🚀 Quick Setup

### 1. Create Environment File
Create a `.env` file in the `src/backend/` directory with your DeepSeek API key:

```bash
# Navigate to backend directory
cd src/backend

# Create .env file
echo "DEEPSEEK_API_KEY=sk-4012d3212b914b39a5b52752090d7f29" > .env
echo "PREFERRED_PROVIDER=deepseek" >> .env
echo "PORT=5000" >> .env
echo "NODE_ENV=development" >> .env
```

### 2. Install Dependencies
```bash
# Install backend dependencies
npm install

# Install new AI provider dependencies
npm install @anthropic-ai/sdk
```

### 3. Start the Application
```bash
# From project root, use the automated startup script
.\start-dev.ps1
```

## 🔧 Configuration Details

### Environment Variables
```env
# DeepSeek Configuration (Primary Provider)
DEEPSEEK_API_KEY=sk-4012d3212b914b39a5b52752090d7f29
PREFERRED_PROVIDER=deepseek

# Server Configuration
PORT=5000
NODE_ENV=development
```

### Provider Selection Logic
- **Conversation**: DeepSeek (cost-effective, good quality)
- **Task Extraction**: DeepSeek (structured parsing)
- **Notifications**: DeepSeek (cost-effective)

## 🧪 Testing the Setup

### 1. Check Provider Status
Visit: `http://localhost:5000/api/chat/providers`

Expected response:
```json
{
  "success": true,
  "providers": {
    "openai": false,
    "claude": false,
    "deepseek": true,
    "available": true
  },
  "message": "AI providers available"
}
```

### 2. Test Chat Interface
1. Open the frontend: `http://localhost:3001`
2. Type a message like: "I need to finish the quarterly report by Friday"
3. You should get a response from DeepSeek

### 3. Test Task Extraction
The system will automatically extract tasks from your conversation and create them in the task sidebar.

## 💰 Cost Optimization

DeepSeek is significantly more cost-effective than OpenAI:
- **DeepSeek**: ~$0.14 per 1M tokens
- **OpenAI GPT-4**: ~$30 per 1M tokens
- **Savings**: ~99.5% cost reduction

## 🔄 Adding Other Providers Later

You can easily add other providers by adding their API keys to the `.env` file:

```env
# Add OpenAI as backup
OPENAI_API_KEY=your_openai_key_here

# Add Claude for specific use cases
ANTHROPIC_API_KEY=your_claude_key_here
```

The system will automatically use the best available provider for each use case.

## 🐛 Troubleshooting

### Common Issues

1. **"No AI providers configured"**
   - Check that `.env` file exists in `src/backend/`
   - Verify API key is correct
   - Restart the backend server

2. **"Failed to process message"**
   - Check DeepSeek API key validity
   - Verify internet connection
   - Check server logs for detailed error

3. **Chat not responding**
   - Ensure both frontend and backend are running
   - Check browser console for errors
   - Verify proxy configuration

### Debug Commands
```bash
# Check provider status
curl http://localhost:5000/api/chat/providers

# Test health endpoint
curl http://localhost:5000/api/health

# View server logs
# Check the terminal where backend is running
```

## 📊 Performance Monitoring

The system includes built-in monitoring:
- Provider status tracking
- Response time logging
- Error rate monitoring
- Cost tracking (via API usage)

Monitor these metrics to optimize performance and costs. 