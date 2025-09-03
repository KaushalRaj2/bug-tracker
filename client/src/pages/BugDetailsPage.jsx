import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import BugDetails from '../components/bugs/BugDetails';

const BugDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const handleBugUpdate = (updatedBug) => {
    // Bug was updated, could refresh data or show success message
    console.log('Bug updated:', updatedBug);
  };

  const handleBugDelete = (bugId) => {
    // Bug was deleted, redirect to bugs list
    navigate('/bugs');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <BugDetails
        bugId={id}
        onUpdate={handleBugUpdate}
        onDelete={handleBugDelete}
      />
    </div>
  );
};

export default BugDetailsPage;
