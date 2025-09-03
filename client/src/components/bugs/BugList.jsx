import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  PlusIcon,
  ListBulletIcon,
  Squares2X2Icon,
  BugAntIcon 
} from '@heroicons/react/24/outline';
import BugCard from './BugCard';
import BugFilters from './BugFilters';
import Button from '../ui/Button';
import { useBugs } from '../../context/BugContext';
import { useAuth } from '../../context/AuthContext';

const BugList = ({ 
  viewMode = 'list',
  onViewModeChange,
  showFilters = true,
  showCreateButton = true 
}) => {
  const { bugs, loading, error } = useBugs();
  const { user } = useAuth();
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    priority: '',
    category: '',
    assignedTo: '',
    reportedBy: ''
  });

  // Filter bugs based on current filters
  const filteredBugs = useMemo(() => {
    if (!bugs) return [];

    return bugs.filter(bug => {
      const matchesSearch = !filters.search || 
        bug.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        bug.description.toLowerCase().includes(filters.search.toLowerCase());

      const matchesStatus = !filters.status || bug.status === filters.status;
      const matchesPriority = !filters.priority || bug.priority === filters.priority;
      const matchesCategory = !filters.category || bug.category === filters.category;
      const matchesAssignedTo = !filters.assignedTo || bug.assignedTo?._id === filters.assignedTo;
      const matchesReportedBy = !filters.reportedBy || bug.reportedBy?._id === filters.reportedBy;

      return matchesSearch && matchesStatus && matchesPriority && 
             matchesCategory && matchesAssignedTo && matchesReportedBy;
    });
  }, [bugs, filters]);

  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      status: '',
      priority: '',
      category: '',
      assignedTo: '',
      reportedBy: ''
    });
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {/* Skeleton loading */}
        {[...Array(5)].map((_, index) => (
          <div key={index} className="bg-white rounded-lg border p-6 animate-pulse">
            <div className="flex items-start space-x-4">
              <div className="flex-1 space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                <div className="h-3 bg-gray-200 rounded w-full"></div>
                <div className="flex space-x-2">
                  <div className="h-6 bg-gray-200 rounded w-16"></div>
                  <div className="h-6 bg-gray-200 rounded w-20"></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 text-lg font-semibold mb-2">
          Error Loading Bugs
        </div>
        <p className="text-gray-600 mb-4">{error}</p>
        <Button onClick={() => window.location.reload()}>
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Bug Reports
          </h1>
          <p className="text-gray-600">
            {filteredBugs.length} of {bugs?.length || 0} bugs
          </p>
        </div>

        <div className="flex items-center space-x-3">
          {/* View mode toggle */}
          {onViewModeChange && (
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => onViewModeChange('list')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'list' 
                    ? 'bg-white shadow-sm' 
                    : 'hover:bg-gray-200'
                }`}
              >
                <ListBulletIcon className="h-4 w-4" />
              </button>
              <button
                onClick={() => onViewModeChange('grid')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'grid' 
                    ? 'bg-white shadow-sm' 
                    : 'hover:bg-gray-200'
                }`}
              >
                <Squares2X2Icon className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* Create bug button */}
          {showCreateButton && (
            <Link to="/bugs/new">
              <Button>
                <PlusIcon className="h-4 w-4 mr-2" />
                Report Bug
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <BugFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          onClearFilters={clearFilters}
          resultCount={filteredBugs.length}
        />
      )}

      {/* Bug list */}
      {filteredBugs.length === 0 ? (
        <div className="text-center py-12">
          <BugAntIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {filters.search || filters.status || filters.priority ? 
              'No bugs match your filters' : 'No bugs found'
            }
          </h3>
          <p className="text-gray-500 mb-6">
            {filters.search || filters.status || filters.priority ? 
              'Try adjusting your search criteria.' :
              'Get started by reporting your first bug.'
            }
          </p>
          {filters.search || filters.status || filters.priority ? (
            <Button variant="outline" onClick={clearFilters}>
              Clear Filters
            </Button>
          ) : (
            <Link to="/bugs/new">
              <Button>
                <PlusIcon className="h-4 w-4 mr-2" />
                Report First Bug
              </Button>
            </Link>
          )}
        </div>
      ) : (
        <div className={
          viewMode === 'grid' 
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
            : 'space-y-4'
        }>
          {filteredBugs.map((bug) => (
            <BugCard 
              key={bug._id} 
              bug={bug}
              onClick={(bug) => {
                // Handle card click if needed
                console.log('Bug clicked:', bug._id);
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default BugList;
