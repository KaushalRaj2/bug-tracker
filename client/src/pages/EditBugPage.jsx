import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import BugForm from '../components/bugs/BugForm';
import { bugService } from '../services/bugService';
import { useAuth } from '../context/AuthContext';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

const EditBugPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [bug, setBug] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id) {
      loadBug();
    }
  }, [id]);

  const loadBug = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await bugService.getBug(id);
      setBug(response.bug);
      
      // Check permissions
      if (!canEditBug(response.bug)) {
        setError('You don\'t have permission to edit this bug');
        return;
      }
    } catch (error) {
      console.error('Failed to load bug:', error);
      setError(error.message || 'Failed to load bug details');
    } finally {
      setLoading(false);
    }
  };

  const canEditBug = (bugToCheck) => {
    if (!user || !bugToCheck) return false;
    
    return (
      user.role === 'admin' ||
      user._id === bugToCheck.reportedBy?._id ||
      user._id === bugToCheck.assignedTo?._id ||
      (user.role === 'developer' && bugToCheck.assignedTo?._id === user._id) ||
      (user.role === 'tester')
    );
  };

  const handleSubmit = (updatedBug) => {
    navigate(`/bugs/${updatedBug._id}`);
  };

  const handleCancel = () => {
    navigate(`/bugs/${id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading bug details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-2xl mx-auto py-12 px-4">
          <Card className="text-center py-12">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Unable to Edit Bug
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {error}
            </p>
            <div className="space-x-4">
              <Button 
                variant="outline"
                onClick={() => navigate(`/bugs/${id}`)}
              >
                View Bug
              </Button>
              <Button onClick={() => navigate('/bugs')}>
                Back to Bug List
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  if (!bug) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-2xl mx-auto py-12 px-4">
          <Card className="text-center py-12">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Bug Not Found
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              The bug you're trying to edit doesn't exist or has been deleted.
            </p>
            <Button onClick={() => navigate('/bugs')}>
              Back to Bug List
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="py-8">
        <BugForm
          bug={bug}
          isEditing={true}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      </div>
    </div>
  );
};

export default EditBugPage;
