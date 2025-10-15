import React from 'react';
import { formatDate, isTaskOverdue } from '../utils/taskAPI';

const TaskItem = ({ task, onToggleStatus, onEdit, onDelete }) => {
  const isOverdue = isTaskOverdue(task.dueDate, task.status);
  const isDone = task.status === 'done';

  const handleToggleStatus = () => {
    onToggleStatus(task.id);
  };

  const handleEdit = () => {
    onEdit(task);
  };

  const handleDelete = () => {
    onDelete(task.id);
  };

  return (
    <div className={`bg-white rounded-lg shadow-sm p-6 border-l-4 transition-all duration-200 hover:shadow-md ${
      isDone 
        ? 'border-green-500 bg-gray-50' 
        : isOverdue 
          ? 'border-red-500' 
          : 'border-blue-500'
    }`}>
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
        <div className="flex-1">
          <h3 className={`text-xl font-semibold mb-3 ${isDone ? 'line-through text-gray-500' : 'text-gray-800'}`}>
            {task.title}
          </h3>
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <span className="text-sm text-gray-600">
              Due: {formatDate(task.dueDate)}
              {isOverdue && <span className="text-red-500 font-semibold"> (Overdue)</span>}
            </span>
            
            <label className="flex items-center cursor-pointer text-sm">
              <input
                type="checkbox"
                checked={isDone}
                onChange={handleToggleStatus}
                className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500 focus:ring-2 mr-2"
              />
              <span className="text-gray-700">
                {isDone ? 'Completed' : 'Mark as done'}
              </span>
            </label>
          </div>
        </div>
        
        <div className="flex gap-2 flex-shrink-0">
          <button
            className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-1.5 rounded text-sm font-medium transition-colors duration-200"
            onClick={handleEdit}
            title="Edit task"
          >
            Edit
          </button>
          <button
            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded text-sm font-medium transition-colors duration-200"
            onClick={handleDelete}
            title="Delete task"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskItem;