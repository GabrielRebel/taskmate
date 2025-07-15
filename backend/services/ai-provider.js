require('dotenv').config();

const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;
const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';

// Simple task extraction: look for lines like 'Task: <title> - <description>'
function extractTasksFromText(text) {
  const taskRegex = /^Task:\s*(.+?)(?:\s*-\s*(.+))?$/gim;
  const tasks = [];
  let match;
  while ((match = taskRegex.exec(text)) !== null) {
    tasks.push({
      title: match[1].trim(),
      description: match[2] ? match[2].trim() : '',
      priority: 'medium',
    });
  }
  return tasks;
}

async function getAIResponse(message) {
  if (!DEEPSEEK_API_KEY) {
    return { response: `Echo: ${message}` };
  }
  try {
    const res = await fetch(DEEPSEEK_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: 'You are TaskMate, a productivity assistant. If the user mentions a task, reply with the task in the format: Task: <title> - <description>.' },
          { role: 'user', content: message },
        ],
        max_tokens: 256,
        temperature: 0.7,
      }),
    });
    if (!res.ok) {
      throw new Error(`DeepSeek API error: ${res.status} ${res.statusText}`);
    }
    const data = await res.json();
    const aiMessage = data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content
      ? data.choices[0].message.content.trim()
      : 'Sorry, I could not generate a response.';
    const tasks = extractTasksFromText(aiMessage);
    return { response: aiMessage, tasks };
  } catch (error) {
    return { response: `Echo: ${message} (AI error: ${error.message})` };
  }
}

module.exports = {
  getAIResponse,
}; 