import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import BugList from '../components/bugs/BugList';
import BugBoard from '../components/bugs/BugBoard';
import { useBugs } from '../context/BugContext';
import { useAuth } from '../context/AuthContext';

const BugsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState(searchParams.get('view') || 'list');
  const { bugs, fetchBugs, updateBug, loading } = useBugs();
  const { user } = useAuth();

  useEffect(() => {
    // Load bugs when component mounts
    const filters = {};
    
    // Apply URL search params as filters
    for (let [key, value] of searchParams.entries()) {
      if (key !== 'view') {
        filters[key] = value;
      }
    }

    fetchBugs(filters);
  }, [searchParams, fetchBugs]);

  const handleViewModeChange = (newViewMode) => {
    setViewMode(newViewMode);
    
    // Update URL params
    const newParams = new URLSearchParams(searchParams);
    newParams.set('view', newViewMode);
    setSearchParams(newParams);
  };

  const handleBugUpdate = async (bugId, updates) => {
    try {
      await updateBug(bugId, updates);
    } catch (error) {
      console.error('Failed to update bug:', error);
    }
  };

  const handleCreateBug = () => {
    window.location.href = '/bugs/new';
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {viewMode === 'board' ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Bug Board
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Drag and drop bugs to update their status
                </p>
              </div>
            </div>
            
            <BugBoard
              bugs={bugs}
              onUpdateBug={handleBugUpdate}
              onCreateBug={handleCreateBug}
            />
          </div>
        ) : (
          <BugList
            viewMode={viewMode}
            onViewModeChange={handleViewModeChange}
          />
        )}
      </div>
    </div>
  );
};

export default BugsPage;
