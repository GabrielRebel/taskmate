import React from 'react';
import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import ChatRoute from './ChatRoute';
import TasksRoute from './TasksRoute';
import CalendarPage from './Calendar';
import MissionsRoute from './MissionsRoute';
import './App.css';

const App: React.FC = () => {
  return (
    <BrowserRouter>
    <div className="app">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="sidebar-header">
          <h1>TaskMate</h1>
        </div>
        <nav className="sidebar-nav">
            <NavLink to="/chat" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
              Chat
            </NavLink>
            <NavLink to="/tasks" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
              Tasks
            </NavLink>
            <NavLink to="/calendar" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
              Calendar
            </NavLink>
            <NavLink to="/missions" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
              Missions
            </NavLink>
        </nav>
      </div>
      {/* Main Content */}
      <div className="main-content">
          <Routes>
            <Route path="/chat" element={<ChatRoute />} />
            <Route path="/tasks" element={<TasksRoute />} />
            <Route path="/calendar" element={<CalendarPage />} />
            <Route path="/missions" element={<MissionsRoute />} />
            <Route path="*" element={<ChatRoute />} />
          </Routes>
          </div>
      </div>
    </BrowserRouter>
  );
};

export default App; 