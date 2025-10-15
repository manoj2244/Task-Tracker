import React, { useState } from 'react';
import { TASK_STATUS, SORT_OPTIONS } from '../utils/taskAPI';

const SearchAndFilter = ({ 
  onSearchChange, 
  filter, 
  onFilterChange, 
  sortBy, 
  onSortChange, 
  taskCount, 
  totalCount 
}) => {
  const [searchInput, setSearchInput] = useState('');

  const handleSearchInput = (e) => {
    const value = e.target.value;
    setSearchInput(value);
    onSearchChange(value);
  };

  const clearSearch = () => {
    setSearchInput('');
    onSearchChange('');
  };

  const getFilterLabel = (filterValue) => {
    switch (filterValue) {
      case TASK_STATUS.ALL: return 'All Tasks';
      case TASK_STATUS.PENDING: return 'Pending';
      case TASK_STATUS.DONE: return 'Completed';
      default: return 'All Tasks';
    }
  };

//   const getSortLabel = (sortValue) => {
//     switch (sortValue) {
//       case SORT_OPTIONS.DATE_ASC: return 'Due Date (Earliest)';
//       case SORT_OPTIONS.DATE_DESC: return 'Due Date (Latest)';
//       case SORT_OPTIONS.NAME_ASC: return 'Name (A-Z)';
//       case SORT_OPTIONS.NAME_DESC: return 'Name (Z-A)';
//       default: return 'Due Date (Earliest)';
//     }
//   };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
      <div className="mb-6">
        <div className="relative max-w-md">
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchInput}
            onChange={handleSearchInput}
            className="w-full pl-4 pr-10 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors"
          />
          {searchInput && (
            <button 
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xl w-6 h-6 flex items-center justify-center"
              onClick={clearSearch}
              aria-label="Clear search"
            >
              ×
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        <div className="flex flex-col">
          <label htmlFor="status-filter" className="text-sm font-medium text-gray-700 mb-1">
            Filter by status:
          </label>
          <select
            id="status-filter"
            value={filter}
            onChange={(e) => onFilterChange(e.target.value)}
            className="px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none bg-white min-w-40"
          >
            <option value={TASK_STATUS.ALL}>All Tasks</option>
            <option value={TASK_STATUS.PENDING}>Pending</option>
            <option value={TASK_STATUS.DONE}>Completed</option>
          </select>
        </div>

        <div className="flex flex-col">
          <label htmlFor="sort-select" className="text-sm font-medium text-gray-700 mb-1">
            Sort by:
          </label>
          <select
            id="sort-select"
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none bg-white min-w-48"
          >
            <option value={SORT_OPTIONS.DATE_ASC}>Due Date (Earliest)</option>
            <option value={SORT_OPTIONS.DATE_DESC}>Due Date (Latest)</option>
            <option value={SORT_OPTIONS.NAME_ASC}>Name (A-Z)</option>
            <option value={SORT_OPTIONS.NAME_DESC}>Name (Z-A)</option>
          </select>
        </div>
      </div>

      <div className="pt-3 border-t border-gray-200">
        <span className="text-sm text-gray-600">
          Showing {taskCount} of {totalCount} tasks
          {filter !== TASK_STATUS.ALL && (
            <span className="text-blue-600">
              {' '}• Filtered by: {getFilterLabel(filter)}
            </span>
          )}
          {searchInput && (
            <span className="text-blue-600">
              {' '}• Search: "{searchInput}"
            </span>
          )}
        </span>
      </div>
    </div>
  );
};

export default SearchAndFilter;