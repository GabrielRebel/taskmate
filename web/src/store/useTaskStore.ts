import { create } from 'zustand';

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'pending' | 'completed';
  priority?: 'low' | 'medium' | 'high';
  createdAt: string;
}

interface TaskStore {
  tasks: Task[];
  addTask: (task: Task) => void;
  toggleTaskStatus: (taskId: string) => void;
}

export const useTaskStore = create<TaskStore>((set) => ({
  tasks: [],
  addTask: (task) =>
    set((state) => ({ tasks: [...state.tasks, task] })),
  toggleTaskStatus: (taskId) =>
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === taskId
          ? { ...task, status: task.status === 'completed' ? 'pending' : 'completed' }
          : task
      ),
    })),
})); 