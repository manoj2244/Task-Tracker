// Mock data and API utilities for task management
let taskIdCounter = 4;

export const initialTasks = [
  {
    id: 1,
    title: "Complete project proposal",
    dueDate: "2025-10-20",
    status: "pending",
    createdAt: "2025-10-15T10:00:00Z"
  },
  {
    id: 2,
    title: "Review team feedback",
    dueDate: "2025-10-18",
    status: "done",
    createdAt: "2025-10-14T14:30:00Z"
  },
  {
    id: 3,
    title: "Prepare presentation slides",
    dueDate: "2025-10-25",
    status: "pending",
    createdAt: "2025-10-15T09:15:00Z"
  }
];

// Initialize localStorage with initial tasks if not present
const initializeStorage = () => {
  if (!localStorage.getItem('taskTracker_tasks')) {
    localStorage.setItem('taskTracker_tasks', JSON.stringify(initialTasks));
  }
  // Also update taskIdCounter based on existing tasks
  const existingTasks = JSON.parse(localStorage.getItem('taskTracker_tasks') || '[]');
  if (existingTasks.length > 0) {
    const maxId = Math.max(...existingTasks.map(task => task.id));
    taskIdCounter = maxId + 1;
  }
};

// Mock API functions to simulate backend operations
export const mockAPI = {
  // Get all tasks
  getTasks: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        initializeStorage();
        const tasks = JSON.parse(localStorage.getItem('taskTracker_tasks') || JSON.stringify(initialTasks));
        resolve(tasks);
      }, 100);
    });
  },

  // Create a new task
  createTask: (taskData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        initializeStorage();
        const tasks = JSON.parse(localStorage.getItem('taskTracker_tasks') || JSON.stringify(initialTasks));
        const newTask = {
          id: taskIdCounter++,
          ...taskData,
          createdAt: new Date().toISOString()
        };
        const updatedTasks = [...tasks, newTask];
        localStorage.setItem('taskTracker_tasks', JSON.stringify(updatedTasks));
        resolve(newTask);
      }, 200);
    });
  },

  // Update an existing task
  updateTask: (id, updatedData) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          initializeStorage();
          const tasks = JSON.parse(localStorage.getItem('taskTracker_tasks') || JSON.stringify(initialTasks));
          console.log('Updating task with ID:', id, 'Available tasks:', tasks.map(t => t.id));
          
          const taskIndex = tasks.findIndex(task => Number(task.id) === Number(id));
          
          if (taskIndex === -1) {
            console.error('Task not found with ID:', id);
            reject(new Error(`Task not found with ID: ${id}`));
            return;
          }

          const updatedTask = { ...tasks[taskIndex], ...updatedData };
          tasks[taskIndex] = updatedTask;
          localStorage.setItem('taskTracker_tasks', JSON.stringify(tasks));
          console.log('Task updated successfully:', updatedTask);
          resolve(updatedTask);
        } catch (error) {
          console.error('Error updating task:', error);
          reject(error);
        }
      }, 200);
    });
  },

  // Delete a task
  deleteTask: (id) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          initializeStorage();
          const tasks = JSON.parse(localStorage.getItem('taskTracker_tasks') || JSON.stringify(initialTasks));
          console.log('Deleting task with ID:', id, 'Available tasks:', tasks.map(t => t.id));
          
          const taskIndex = tasks.findIndex(task => Number(task.id) === Number(id));
          
          if (taskIndex === -1) {
            console.error('Task not found with ID:', id);
            reject(new Error(`Task not found with ID: ${id}`));
            return;
          }

          const deletedTask = tasks.splice(taskIndex, 1)[0];
          localStorage.setItem('taskTracker_tasks', JSON.stringify(tasks));
          console.log('Task deleted successfully:', deletedTask);
          resolve(deletedTask);
        } catch (error) {
          console.error('Error deleting task:', error);
          reject(error);
        }
      }, 200);
    });
  }
};

// Task status options
export const TASK_STATUS = {
  ALL: 'all',
  PENDING: 'pending',
  DONE: 'done'
};

// Sort options
export const SORT_OPTIONS = {
  DATE_ASC: 'date_asc',
  DATE_DESC: 'date_desc',
  NAME_ASC: 'name_asc',
  NAME_DESC: 'name_desc'
};

// Utility functions
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export const isTaskOverdue = (dueDate, status) => {
  if (status === 'done') return false;
  const today = new Date();
  const due = new Date(dueDate);
  today.setHours(0, 0, 0, 0);
  due.setHours(0, 0, 0, 0);
  return due < today;
};

// Debounce utility
export const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(null, args), delay);
  };
};

// Utility to reset storage (for debugging)
export const resetStorage = () => {
  localStorage.removeItem('taskTracker_tasks');
  localStorage.setItem('taskTracker_tasks', JSON.stringify(initialTasks));
  console.log('Storage reset with initial tasks');
};
