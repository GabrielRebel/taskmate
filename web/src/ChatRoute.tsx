import React, { useState, useEffect } from 'react';
import { useTaskStore, Task } from './store/useTaskStore';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: string;
}

const CHAT_STORAGE_KEY = 'taskmate_chat_history';

const ChatRoute: React.FC = () => {
  // Load chat history from localStorage if present
  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem(CHAT_STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return [
          {
            id: '1',
            text: "Hello! I'm your TaskMate productivity co-pilot. How can I help you today?",
            sender: 'ai',
            timestamp: new Date().toISOString(),
          },
        ];
      }
    }
    return [
      {
        id: '1',
        text: "Hello! I'm your TaskMate productivity co-pilot. How can I help you today?",
        sender: 'ai',
        timestamp: new Date().toISOString(),
      },
    ];
  });
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const addTask = useTaskStore((state) => state.addTask);

  // Persist chat history to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(messages));
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/chat/message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userMessage.text }),
      });
      const data = await response.json();
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data.data?.response || data.response || 'I understand. Let me help you with that.',
        sender: 'ai',
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, aiMessage]);

      // If tasks were extracted, add them to the global store (fix: use data.data.tasks)
      if (data.data?.tasks && Array.isArray(data.data.tasks)) {
        data.data.tasks.forEach((task: any, index: number) => {
          const newTask: Task = {
            id: `task-${Date.now()}-${index}`,
            title: task.title,
            description: task.description || '',
            status: 'pending',
            priority: task.priority || 'medium',
            createdAt: new Date().toISOString(),
          };
          addTask(newTask);
        });
      }
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          text: 'Sorry, I encountered an error. Please try again.',
          sender: 'ai',
          timestamp: new Date().toISOString(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h2>Chat with TaskMate</h2>
        <p>Your productivity co-pilot</p>
      </div>
      <div className="messages">
        {messages.map((message) => (
          <div key={message.id} className={`message ${message.sender}`}>
            <div className="message-content">{message.text}</div>
            <div className="message-time">
              {new Date(message.timestamp).toLocaleTimeString()}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="message ai">
            <div className="message-content">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="chat-input">
        <textarea
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your message here..."
          disabled={isLoading}
        />
        <button
          onClick={handleSendMessage}
          disabled={isLoading || !inputMessage.trim()}
          className="send-button"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatRoute; 