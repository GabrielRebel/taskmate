import React, { useState } from 'react';
import { useTaskStore, Task } from './store/useTaskStore';

const TasksRoute: React.FC = () => {
  const tasks = useTaskStore((state) => state.tasks);
  const addTask = useTaskStore((state) => state.addTask);
  const toggleTaskStatus = useTaskStore((state) => state.toggleTaskStatus);
  const [newTaskTitle, setNewTaskTitle] = useState('');

  const handleAddTask = () => {
    if (!newTaskTitle.trim()) return;
    const newTask: Task = {
      id: Date.now().toString(),
      title: newTaskTitle,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    addTask(newTask);
    setNewTaskTitle('');
  };

  return (
    <div>
      <h2>Tasks</h2>
      <div style={{ marginBottom: 16 }}>
        <input
          type="text"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          placeholder="New task title"
        />
        <button onClick={handleAddTask}>Add Task</button>
      </div>
      {tasks.length === 0 ? (
        <p>No tasks yet. Add one above!</p>
      ) : (
        <ul>
          {tasks.map((task) => (
            <li key={task.id}>
              <label style={{ textDecoration: task.status === 'completed' ? 'line-through' : 'none' }}>
                <input
                  type="checkbox"
                  checked={task.status === 'completed'}
                  onChange={() => toggleTaskStatus(task.id)}
                />
                {task.title}
              </label>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TasksRoute; 