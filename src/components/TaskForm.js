import React, { useState, useEffect } from 'react';

const TaskForm = ({ task, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    dueDate: '',
    status: 'pending'
  });
  const [errors, setErrors] = useState({});
// eslint-disable-next-line
  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || '',
        dueDate: task.dueDate || '',
        status: task.status || 'pending'
      });
    } else {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowString = tomorrow.toISOString().split('T')[0];
      
      setFormData({
        title: '',
        dueDate: tomorrowString,
        status: 'pending'
      });
    }
  }, [task]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Task title is required';
    } else if (formData.title.trim().length < 3) {
      newErrors.title = 'Task title must be at least 3 characters long';
    }

    if (!formData.dueDate) {
      newErrors.dueDate = 'Due date is required';
    } else {
      const selectedDate = new Date(formData.dueDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        newErrors.dueDate = 'Due date cannot be in the past';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit({
        title: formData.title.trim(),
        dueDate: formData.dueDate,
        status: formData.status
      });
    }
  };

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        {task ? 'Edit Task' : 'Create New Task'}
      </h2>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
            Task Title *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            className={`w-full px-4 py-3 border-2 rounded-lg transition-colors focus:outline-none ${
              errors.title 
                ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500' 
                : 'border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
            }`}
            placeholder="Enter task title..."
            maxLength={100}
          />
          {errors.title && (
            <span className="block mt-1 text-sm text-red-500">{errors.title}</span>
          )}
        </div>

        <div className="mb-6">
          <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-2">
            Due Date *
          </label>
          <input
            type="date"
            id="dueDate"
            name="dueDate"
            value={formData.dueDate}
            onChange={handleInputChange}
            className={`w-full px-4 py-3 border-2 rounded-lg transition-colors focus:outline-none ${
              errors.dueDate 
                ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500' 
                : 'border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
            }`}
          />
          {errors.dueDate && (
            <span className="block mt-1 text-sm text-red-500">{errors.dueDate}</span>
          )}
        </div>

        <div className="mb-8">
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
            Status
          </label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none bg-white"
          >
            <option value="pending">Pending</option>
            <option value="done">Done</option>
          </select>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200">
          <button 
            type="button" 
            className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors duration-200 flex-1 sm:flex-none"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors duration-200 flex-1 sm:flex-none"
          >
            {task ? 'Update Task' : 'Create Task'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TaskForm;