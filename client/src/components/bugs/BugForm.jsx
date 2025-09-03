import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { XMarkIcon, PlusIcon } from '@heroicons/react/24/outline';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Button from '../ui/Button';
import Card from '../ui/Card';
import { BUG_PRIORITY, BUG_CATEGORIES, BUG_STATUS } from '../../utils/constants';
import { validateBugForm } from '../../utils/validators';
import { useUsers } from '../../hooks/useUsers';
import { useAuth } from '../../context/AuthContext';
import { useBugs } from '../../context/BugContext';
import toast from 'react-hot-toast';

const BugForm = ({ 
  bug = null, 
  onSubmit, 
  onCancel,
  isEditing = false 
}) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { createBug, updateBug, loading } = useBugs();
  const { users, getDevelopers } = useUsers();
  const [developers, setDevelopers] = useState([]);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: BUG_PRIORITY.MEDIUM,
    category: '',
    status: BUG_STATUS.OPEN,
    assignedTo: '',
    tags: [],
    stepsToReproduce: '',
    expectedBehavior: '',
    actualBehavior: ''
  });

  const [tagInput, setTagInput] = useState('');
  const [errors, setErrors] = useState({});

  // Initialize form data
  useEffect(() => {
    if (bug && isEditing) {
      setFormData({
        title: bug.title || '',
        description: bug.description || '',
        priority: bug.priority || BUG_PRIORITY.MEDIUM,
        category: bug.category || '',
        status: bug.status || BUG_STATUS.OPEN,
        assignedTo: bug.assignedTo?._id || '',
        tags: bug.tags || [],
        stepsToReproduce: bug.stepsToReproduce || '',
        expectedBehavior: bug.expectedBehavior || '',
        actualBehavior: bug.actualBehavior || ''
      });
    }
  }, [bug, isEditing]);

  // Load developers
  useEffect(() => {
    const loadDevelopers = async () => {
      try {
        const devs = await getDevelopers();
        console.log('👥 Loaded developers:', devs);
        setDevelopers(Array.isArray(devs) ? devs : devs.users || []);
      } catch (error) {
        console.error('Failed to load developers:', error);
        setDevelopers([]);
      }
    };
    loadDevelopers();
  }, [getDevelopers]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleTagAdd = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const handleTagRemove = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleTagInputKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      handleTagAdd();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validation = validateBugForm(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    try {
      console.log('🚀 Starting bug operation...');
      let result;
      
      if (isEditing && bug) {
        result = await updateBug(bug._id, formData);
      } else {
        result = await createBug(formData);
      }

      console.log('📝 Bug operation result:', result);

      // ✅ FIXED: Proper success check
      if (result && result.success === true) {
        console.log('✅ Bug operation successful!');
        
        // ✅ SUCCESS: Show GREEN success toast
        const successMessage = isEditing ? 'Bug updated successfully!' : 'Bug created successfully!';
        toast.success(successMessage);
        
        // ✅ IMMEDIATE REDIRECT
        if (onSubmit) {
          onSubmit(result.bug || result.data);
        } else {
          const redirectPath = isEditing 
            ? `/bugs/${bug._id}` 
            : result.bug?._id 
              ? `/bugs/${result.bug._id}` 
              : '/bugs';
              
          console.log('🔄 Redirecting to:', redirectPath);
          setTimeout(() => {
            navigate(redirectPath, { replace: true });
          }, 100); // Small delay to ensure toast shows
        }
      } else {
        console.log('❌ Bug operation failed:', result);
        
        // ❌ ERROR: Show RED error toast
        const errorMessage = result?.error || result?.message || 'Operation failed';
        toast.error(errorMessage);
        setErrors({ general: errorMessage });
      }
    } catch (error) {
      console.error('💥 Bug operation exception:', error);
      
      // ❌ ERROR: Show RED error toast
      const errorMsg = error.message || 'An unexpected error occurred';
      toast.error(errorMsg);
      setErrors({ general: errorMsg });
    }
  };

  const handleCancelClick = () => {
    if (onCancel) {
      onCancel();
    } else {
      navigate('/bugs');
    }
  };

  const priorityOptions = [
    { value: BUG_PRIORITY.LOW, label: 'Low' },
    { value: BUG_PRIORITY.MEDIUM, label: 'Medium' },
    { value: BUG_PRIORITY.HIGH, label: 'High' },
    { value: BUG_PRIORITY.CRITICAL, label: 'Critical' }
  ];

  const categoryOptions = [
    { value: BUG_CATEGORIES.FRONTEND, label: 'Frontend' },
    { value: BUG_CATEGORIES.BACKEND, label: 'Backend' },
    { value: BUG_CATEGORIES.DATABASE, label: 'Database' },
    { value: BUG_CATEGORIES.UI_UX, label: 'UI/UX' },
    { value: BUG_CATEGORIES.PERFORMANCE, label: 'Performance' }
  ];

  const statusOptions = [
    { value: BUG_STATUS.OPEN, label: 'Open' },
    { value: BUG_STATUS.IN_PROGRESS, label: 'In Progress' },
    { value: BUG_STATUS.TESTING, label: 'Testing' },
    { value: BUG_STATUS.CLOSED, label: 'Closed' }
  ];

  return (
    <Card className="max-w-4xl mx-auto">
      <Card.Header>
        <Card.Title>
          {isEditing ? 'Edit Bug Report' : 'Report New Bug'}
        </Card.Title>
      </Card.Header>

      <Card.Content>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* General error */}
          {errors.general && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3">
              <p className="text-sm text-red-600">{errors.general}</p>
            </div>
          )}

          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <Input
                label="Bug Title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                error={errors.title}
                placeholder="Brief description of the bug"
                required
                disabled={loading}
              />
            </div>

            <Select
              label="Priority"
              name="priority"
              value={formData.priority}
              onChange={handleInputChange}
              error={errors.priority}
              required
              disabled={loading}
            >
              {priorityOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>

            <Select
              label="Category"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              error={errors.category}
              required
              disabled={loading}
              placeholder="Select category"
            >
              <option value="">Select category</option>
              {categoryOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>

            {/* Show status and assignment for editing or admin users */}
            {(isEditing || user?.role === 'admin') && (
              <>
                <Select
                  label="Status"
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  disabled={loading}
                >
                  {statusOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Select>

                <Select
                  label="Assign to Developer"
                  name="assignedTo"
                  value={formData.assignedTo}
                  onChange={handleInputChange}
                  disabled={loading}
                  placeholder="Select developer"
                >
                  <option value="">Unassigned</option>
                  {developers.map(dev => (
                    <option key={dev._id || dev.id} value={dev._id || dev.id}>
                      {dev.name}
                    </option>
                  ))}
                </Select>
              </>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
              className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="Detailed description of the bug"
              required
              disabled={loading}
            />
            {errors.description && (
              <p className="text-sm text-red-600 mt-1">{errors.description}</p>
            )}
          </div>

          {/* Steps to Reproduce */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Steps to Reproduce
            </label>
            <textarea
              name="stepsToReproduce"
              value={formData.stepsToReproduce}
              onChange={handleInputChange}
              rows={3}
              className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="1. Go to...&#10;2. Click on...&#10;3. See error"
              disabled={loading}
            />
          </div>

          {/* Expected vs Actual Behavior */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Expected Behavior
              </label>
              <textarea
                name="expectedBehavior"
                value={formData.expectedBehavior}
                onChange={handleInputChange}
                rows={3}
                className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="What should happen?"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Actual Behavior
              </label>
              <textarea
                name="actualBehavior"
                value={formData.actualBehavior}
                onChange={handleInputChange}
                rows={3}
                className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="What actually happens?"
                disabled={loading}
              />
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Tags
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleTagRemove(tag)}
                    className="flex-shrink-0 ml-1.5 h-4 w-4 rounded-full inline-flex items-center justify-center text-blue-400 hover:bg-blue-200 hover:text-blue-500"
                    disabled={loading}
                  >
                    <XMarkIcon className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex space-x-2">
              <Input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagInputKeyDown}
                placeholder="Add tags..."
                disabled={loading}
                className="flex-1"
              />
              <Button
                type="button"
                variant="outline"
                onClick={handleTagAdd}
                disabled={loading || !tagInput.trim()}
              >
                <PlusIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancelClick}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              loading={loading}
              disabled={loading}
            >
              {isEditing ? 'Update Bug' : 'Create Bug'}
            </Button>
          </div>
        </form>
      </Card.Content>
    </Card>
  );
};

export default BugForm;
