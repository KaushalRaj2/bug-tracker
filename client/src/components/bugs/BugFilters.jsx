import React, { useState } from 'react';
import { 
  FunnelIcon, 
  XMarkIcon,
  MagnifyingGlassIcon 
} from '@heroicons/react/24/outline';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import { BUG_STATUS, BUG_PRIORITY, BUG_CATEGORIES } from '../../utils/constants';
import { useUsers } from '../../hooks/useUsers';
import { useAuth } from '../../context/AuthContext';

const BugFilters = ({ 
  filters = {},
  onFilterChange,
  onClearFilters,
  resultCount = 0 
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const { users } = useUsers();
  const { user } = useAuth();

  const handleInputChange = (name, value) => {
    onFilterChange({ [name]: value });
  };

  const getActiveFilterCount = () => {
    return Object.values(filters).filter(value => value && value !== '').length;
  };

  const statusOptions = [
    { value: '', label: 'All Status' },
    { value: BUG_STATUS.OPEN, label: 'Open' },
    { value: BUG_STATUS.IN_PROGRESS, label: 'In Progress' },
    { value: BUG_STATUS.TESTING, label: 'Testing' },
    { value: BUG_STATUS.CLOSED, label: 'Closed' },
    { value: BUG_STATUS.REOPENED, label: 'Reopened' }
  ];

  const priorityOptions = [
    { value: '', label: 'All Priorities' },
    { value: BUG_PRIORITY.CRITICAL, label: 'Critical' },
    { value: BUG_PRIORITY.HIGH, label: 'High' },
    { value: BUG_PRIORITY.MEDIUM, label: 'Medium' },
    { value: BUG_PRIORITY.LOW, label: 'Low' }
  ];

  const categoryOptions = [
    { value: '', label: 'All Categories' },
    { value: BUG_CATEGORIES.FRONTEND, label: 'Frontend' },
    { value: BUG_CATEGORIES.BACKEND, label: 'Backend' },
    { value: BUG_CATEGORIES.DATABASE, label: 'Database' },
    { value: BUG_CATEGORIES.UI_UX, label: 'UI/UX' },
    { value: BUG_CATEGORIES.PERFORMANCE, label: 'Performance' }
  ];

  const userOptions = [
    { value: '', label: 'All Users' },
    ...users.map(u => ({ value: u._id, label: u.name }))
  ];

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-4">
      {/* Search and basic filters */}
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search */}
        <div className="flex-1">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search bugs by title, description, or ID..."
              value={filters.search || ''}
              onChange={(e) => handleInputChange('search', e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Quick filters */}
        <div className="flex flex-wrap gap-2">
          <Select
            value={filters.status || ''}
            onChange={(e) => handleInputChange('status', e.target.value)}
            className="w-40"
          >
            {statusOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>

          <Select
            value={filters.priority || ''}
            onChange={(e) => handleInputChange('priority', e.target.value)}
            className="w-40"
          >
            {priorityOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>

          {/* Advanced filters toggle */}
          <Button
            variant="outline"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center space-x-2"
          >
            <FunnelIcon className="h-4 w-4" />
            <span>
              Filters
              {getActiveFilterCount() > 0 && (
                <Badge size="xs" className="ml-2">
                  {getActiveFilterCount()}
                </Badge>
              )}
            </span>
          </Button>
        </div>
      </div>

      {/* Advanced filters */}
      {showAdvanced && (
        <div className="pt-4 border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Select
              label="Category"
              value={filters.category || ''}
              onChange={(e) => handleInputChange('category', e.target.value)}
            >
              {categoryOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>

            <Select
              label="Assigned To"
              value={filters.assignedTo || ''}
              onChange={(e) => handleInputChange('assignedTo', e.target.value)}
            >
              {userOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>

            <Select
              label="Reported By"
              value={filters.reportedBy || ''}
              onChange={(e) => handleInputChange('reportedBy', e.target.value)}
            >
              {userOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </div>
        </div>
      )}

      {/* Filter summary and clear button */}
      {getActiveFilterCount() > 0 && (
        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <span className="text-sm text-gray-600">
            Showing {resultCount} results with {getActiveFilterCount()} active filter{getActiveFilterCount() !== 1 ? 's' : ''}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="flex items-center space-x-1"
          >
            <XMarkIcon className="h-4 w-4" />
            <span>Clear All</span>
          </Button>
        </div>
      )}
    </div>
  );
};

export default BugFilters;
