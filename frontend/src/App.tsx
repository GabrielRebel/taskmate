import React, { useState, useEffect } from 'react';
import './App.css';

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'completed';
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
}

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: string;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: string;
}

// Simple SVG Icons
const MessageIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
  </svg>
);

const CheckIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M9 11l3 3L22 4"/>
    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
  </svg>
);

const BellIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
    <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
  </svg>
);

const TargetIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10"/>
    <circle cx="12" cy="12" r="6"/>
    <circle cx="12" cy="12" r="2"/>
  </svg>
);

const SendIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="22" y1="2" x2="11" y2="13"/>
    <polygon points="22,2 15,22 11,13 2,9"/>
  </svg>
);

const PlusIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="12" y1="5" x2="12" y2="19"/>
    <line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'chat' | 'tasks' | 'notifications' | 'missions'>('chat');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! I\'m your TaskMate productivity co-pilot. How can I help you today?',
      sender: 'ai',
      timestamp: new Date().toISOString()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/chat/message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: inputMessage }),
      });

      const data = await response.json();
      console.log('Backend response:', data); // Debug log
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data.data?.response || data.response || 'I understand. Let me help you with that.',
        sender: 'ai',
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, aiMessage]);

      // If tasks were extracted, add them
      if (data.tasks && data.tasks.length > 0) {
        const newTasks = data.tasks.map((task: any, index: number) => ({
          id: `task-${Date.now()}-${index}`,
          title: task.title,
          description: task.description,
          status: 'pending' as const,
          priority: task.priority || 'medium',
          createdAt: new Date().toISOString()
        }));
        setTasks(prev => [...prev, ...newTasks]);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Sorry, I encountered an error. Please try again.',
        sender: 'ai',
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMessage]);
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

  const toggleTaskStatus = (taskId: string) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId 
        ? { ...task, status: task.status === 'completed' ? 'pending' : 'completed' }
        : task
    ));
  };

  const addTask = () => {
    const title = prompt('Enter task title:');
    if (title) {
      const newTask: Task = {
        id: Date.now().toString(),
        title,
        description: '',
        status: 'pending',
        priority: 'medium',
        createdAt: new Date().toISOString()
      };
      setTasks(prev => [...prev, newTask]);
    }
  };

  return (
    <div className="app">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="sidebar-header">
          <TargetIcon />
          <h1>TaskMate</h1>
        </div>
        
        <nav className="sidebar-nav">
          <button 
            className={`nav-item ${activeTab === 'chat' ? 'active' : ''}`}
            onClick={() => setActiveTab('chat')}
          >
            <MessageIcon />
            <span>Chat</span>
          </button>
          
          <button 
            className={`nav-item ${activeTab === 'tasks' ? 'active' : ''}`}
            onClick={() => setActiveTab('tasks')}
          >
            <CheckIcon />
            <span>Tasks ({tasks.filter(t => t.status === 'pending').length})</span>
          </button>
          
          <button 
            className={`nav-item ${activeTab === 'notifications' ? 'active' : ''}`}
            onClick={() => setActiveTab('notifications')}
          >
            <BellIcon />
            <span>Notifications ({notifications.length})</span>
          </button>
          
          <button 
            className={`nav-item ${activeTab === 'missions' ? 'active' : ''}`}
            onClick={() => setActiveTab('missions')}
          >
            <TargetIcon />
            <span>Missions</span>
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {activeTab === 'chat' && (
          <div className="chat-container">
            <div className="chat-header">
              <h2>Chat with TaskMate</h2>
              <p>Your productivity co-pilot</p>
            </div>
            
            <div className="messages">
              {messages.map(message => (
                <div key={message.id} className={`message ${message.sender}`}>
                  <div className="message-content">
                    {message.text}
                  </div>
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
                <SendIcon />
              </button>
            </div>
          </div>
        )}

        {activeTab === 'tasks' && (
          <div className="tasks-container">
            <div className="tasks-header">
              <h2>Tasks</h2>
              <button onClick={addTask} className="add-task-btn">
                <PlusIcon />
                Add Task
              </button>
            </div>
            
            <div className="tasks-list">
              {tasks.length === 0 ? (
                <div className="empty-state">
                  <CheckIcon />
                  <h3>No tasks yet</h3>
                  <p>Start a conversation to extract tasks, or add one manually.</p>
                </div>
              ) : (
                tasks.map(task => (
                  <div key={task.id} className={`task-item ${task.status}`}>
                    <div className="task-content">
                      <input
                        type="checkbox"
                        checked={task.status === 'completed'}
                        onChange={() => toggleTaskStatus(task.id)}
                      />
                      <div className="task-details">
                        <h4>{task.title}</h4>
                        {task.description && <p>{task.description}</p>}
                        <div className="task-meta">
                          <span className={`priority ${task.priority}`}>
                            {task.priority}
                          </span>
                          <span className="created">
                            {new Date(task.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'notifications' && (
          <div className="notifications-container">
            <div className="notifications-header">
              <h2>Notifications</h2>
            </div>
            
            <div className="notifications-list">
              {notifications.length === 0 ? (
                <div className="empty-state">
                  <BellIcon />
                  <h3>No notifications</h3>
                  <p>You're all caught up!</p>
                </div>
              ) : (
                notifications.map(notification => (
                  <div key={notification.id} className={`notification-item ${notification.type}`}>
                    <div className="notification-content">
                      <h4>{notification.title}</h4>
                      <p>{notification.message}</p>
                      <span className="notification-time">
                        {new Date(notification.timestamp).toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'missions' && (
          <div className="missions-container">
            <div className="missions-header">
              <h2>Missions</h2>
            </div>
            
            <div className="missions-content">
              <div className="empty-state">
                <TargetIcon />
                <h3>Missions Coming Soon</h3>
                <p>Long-term goals and mission tracking will be available in the next update.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App; 