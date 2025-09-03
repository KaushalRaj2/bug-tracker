import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import BugForm from '../components/bugs/BugForm';
import { bugService } from '../services/bugService';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const CreateBugPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [bug, setBug] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const isEditing = Boolean(id);

  useEffect(() => {
    if (isEditing) {
      loadBug();
    }
  }, [id, isEditing]);

  const loadBug = async () => {
    try {
      setLoading(true);
      const response = await bugService.getBug(id);
      setBug(response.bug);
    } catch (error) {
      console.error('Failed to load bug:', error);
      toast.error('Bug not found');
      navigate('/bugs');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (savedBug) => {
    console.log('🎉 Bug saved successfully, navigating...');
    // Navigate to bug detail page or bugs list
    if (savedBug?._id) {
      navigate(`/bugs/${savedBug._id}`, { replace: true });
    } else {
      navigate('/bugs', { replace: true });
    }
  };

  const handleCancel = () => {
    if (isEditing && bug) {
      navigate(`/bugs/${bug._id}`, { replace: true });
    } else {
      navigate('/bugs', { replace: true });
    }
  };

  if (isEditing && loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="py-8">
        <BugForm
          bug={bug}
          isEditing={isEditing}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      </div>
    </div>
  );
};

export default CreateBugPage;
