import React, { useState, useEffect, useCallback } from 'react';
import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm';
import SearchAndFilter from './components/SearchAndFilter';
import Modal from './components/Modal';
import { mockAPI, TASK_STATUS, SORT_OPTIONS, debounce } from './utils/taskAPI';

function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [filter, setFilter] = useState(TASK_STATUS.ALL);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState(SORT_OPTIONS.DATE_ASC);

  
  useEffect(() => {
    // eslint-disable-next-line
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      setLoading(true);
      const fetchedTasks = await mockAPI.getTasks();
      setTasks(fetchedTasks);
    } catch (error) {
      console.error('Failed to load tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (taskData) => {
    try {
      const newTask = await mockAPI.createTask(taskData);
      setTasks(prevTasks => [...prevTasks, newTask]);
      setShowModal(false);
    } catch (error) {
      console.error('Failed to create task:', error);
    }
  };

  const handleUpdateTask = async (taskData) => {
    try {
      const updatedTask = await mockAPI.updateTask(editingTask.id, taskData);
      setTasks(prevTasks => 
        prevTasks.map(task => 
          task.id === editingTask.id ? updatedTask : task
        )
      );
      setShowModal(false);
      setEditingTask(null);
    } catch (error) {
      console.error('Failed to update task:', error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) {
      return;
    }

    try {
      await mockAPI.deleteTask(taskId);
      setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
    } catch (error) {
      console.error('Failed to delete task:', error);
    }
  };

  const handleToggleTaskStatus = async (taskId) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    const newStatus = task.status === 'done' ? 'pending' : 'done';
    
    try {
      const updatedTask = await mockAPI.updateTask(taskId, { status: newStatus });
      setTasks(prevTasks => 
        prevTasks.map(t => 
          t.id === taskId ? updatedTask : t
        )
      );
    } catch (error) {
      console.error('Failed to toggle task status:', error);
    }
  };

  const openCreateModal = () => {
    setEditingTask(null);
    setShowModal(true);
  };

  const openEditModal = (task) => {
    setEditingTask(task);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingTask(null);
  };

  // Debounced search function
  const handleSearchChange = useCallback((term) => {
    const debouncedFn = debounce((searchTerm) => {
      setSearchTerm(searchTerm);
    }, 300);
    debouncedFn(term);
  }, []);

  const getFilteredAndSortedTasks = () => {
    let filteredTasks = tasks;

    if (filter !== TASK_STATUS.ALL) {
      filteredTasks = filteredTasks.filter(task => task.status === filter);
    }

    if (searchTerm.trim()) {
      filteredTasks = filteredTasks.filter(task =>
        task.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    filteredTasks.sort((a, b) => {
      switch (sortBy) {
        case SORT_OPTIONS.DATE_ASC:
          return new Date(a.dueDate) - new Date(b.dueDate);
        case SORT_OPTIONS.DATE_DESC:
          return new Date(b.dueDate) - new Date(a.dueDate);
        case SORT_OPTIONS.NAME_ASC:
          return a.title.toLowerCase().localeCompare(b.title.toLowerCase());
        case SORT_OPTIONS.NAME_DESC:
          return b.title.toLowerCase().localeCompare(a.title.toLowerCase());
        default:
          return 0;
      }
    });

    return filteredTasks;
  };

  const filteredAndSortedTasks = getFilteredAndSortedTasks();

  // Debug logging
  console.log('Current tasks:', tasks);
  console.log('Filtered and sorted tasks:', filteredAndSortedTasks);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading tasks...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <header className="flex flex-col sm:flex-row justify-between items-center mb-8 pb-6 border-b-2 border-gray-200">
          <h1 className="text-4xl font-bold text-gray-800 mb-4 sm:mb-0">Task Tracker</h1>
          <button 
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 hover:shadow-lg"
            onClick={openCreateModal}
          >
            Add New Task
          </button>
        </header>

        <main>
          <SearchAndFilter
            onSearchChange={handleSearchChange}
            filter={filter}
            onFilterChange={setFilter}
            sortBy={sortBy}
            onSortChange={setSortBy}
            taskCount={filteredAndSortedTasks.length}
            totalCount={tasks.length}
          />

          <TaskList
            tasks={filteredAndSortedTasks}
            onToggleStatus={handleToggleTaskStatus}
            onEdit={openEditModal}
            onDelete={handleDeleteTask}
          />
        </main>

        {showModal && (
          <Modal onClose={closeModal}>
            <TaskForm
              task={editingTask}
              onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
              onCancel={closeModal}
            />
          </Modal>
        )}
      </div>
    </div>
  );
}

export default App;