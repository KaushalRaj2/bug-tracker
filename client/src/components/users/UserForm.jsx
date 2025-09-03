import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Button from '../ui/Button';
import Card from '../ui/Card';
import { USER_ROLES } from '../../utils/constants';
import { validateUserForm, validateEmail, validatePassword } from '../../utils/validators';
import { useUsers } from '../../hooks/useUsers';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const UserForm = ({ 
  user = null, 
  onSubmit, 
  onCancel,
  isEditing = false 
}) => {
  const navigate = useNavigate();
  const { createUser, updateUser, loading } = useUsers();
  const { user: currentUser } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: USER_ROLES.REPORTER,
    isActive: true
  });

  const [errors, setErrors] = useState({});

  // Initialize form data for editing
  useEffect(() => {
    if (user && isEditing) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        password: '', // Always empty for editing
        confirmPassword: '',
        role: user.role || USER_ROLES.REPORTER,
        isActive: user.isActive !== undefined ? user.isActive : true
      });
    }
  }, [user, isEditing]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    
    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    // Password validation (only for new users or when password is provided)
    if (!isEditing || formData.password) {
      if (!formData.password) {
        newErrors.password = 'Password is required';
      } else if (!validatePassword(formData.password)) {
        newErrors.password = 'Password must be at least 6 characters';
      }

      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your password';
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    // Role validation
    if (!formData.role) {
      newErrors.role = 'Please select a role';
    }

    // Permission check for admin role
    if (formData.role === USER_ROLES.ADMIN && currentUser?.role !== USER_ROLES.ADMIN) {
      newErrors.role = 'Only administrators can create admin users';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      const userData = {
        name: formData.name.trim(),
        email: formData.email.toLowerCase().trim(),
        role: formData.role,
        isActive: formData.isActive
      };

      // Only include password if it's provided
      if (formData.password) {
        userData.password = formData.password;
      }

      let result;
      if (isEditing && user) {
        result = await updateUser(user._id, userData);
      } else {
        result = await createUser(userData);
      }

      if (result.success) {
        if (onSubmit) {
          onSubmit(result.user);
        } else {
          navigate('/users');
        }
      } else {
        setErrors({ general: result.error });
      }
    } catch (error) {
      setErrors({ general: 'An unexpected error occurred' });
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      navigate('/users');
    }
  };

  const canManageUsers = () => {
    return currentUser?.role === USER_ROLES.ADMIN;
  };

  const canEditRole = () => {
    return currentUser?.role === USER_ROLES.ADMIN;
  };

  const canEditActiveStatus = () => {
    return currentUser?.role === USER_ROLES.ADMIN && 
           isEditing && 
           user && 
           currentUser._id !== user._id; // Can't deactivate self
  };

  if (!canManageUsers() && !isEditing) {
    return (
      <Card className="max-w-2xl mx-auto text-center py-12">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Access Denied
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          You don't have permission to create new users.
        </p>
        <Button onClick={() => navigate('/users')}>
          Back to Users
        </Button>
      </Card>
    );
  }

  const roleOptions = [
    { value: USER_ROLES.REPORTER, label: 'Bug Reporter' },
    { value: USER_ROLES.DEVELOPER, label: 'Developer' },
    { value: USER_ROLES.TESTER, label: 'QA Tester' }
  ];

  // Only admins can create admin users
  if (currentUser?.role === USER_ROLES.ADMIN) {
    roleOptions.push({ value: USER_ROLES.ADMIN, label: 'Administrator' });
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <Card.Header>
        <Card.Title>
          {isEditing ? 'Edit User' : 'Add New User'}
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
            <Input
              label="Full Name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              error={errors.name}
              placeholder="Enter full name"
              required
              disabled={loading}
            />

            <Input
              label="Email Address"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              error={errors.email}
              placeholder="Enter email address"
              required
              disabled={loading}
            />
          </div>

          {/* Role and Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Select
              label="Role"
              name="role"
              value={formData.role}
              onChange={handleInputChange}
              error={errors.role}
              required
              disabled={loading || !canEditRole()}
            >
              {roleOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>

            {canEditActiveStatus() && (
              <div className="flex items-center space-x-2 pt-8">
                <input
                  type="checkbox"
                  id="isActive"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleInputChange}
                  disabled={loading}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="isActive" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Active User
                </label>
              </div>
            )}
          </div>

          {/* Password fields */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              {isEditing ? 'Change Password (Optional)' : 'Password'}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="relative">
                <Input
                  label={isEditing ? "New Password" : "Password"}
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  error={errors.password}
                  placeholder={isEditing ? "Leave empty to keep current" : "Enter password"}
                  required={!isEditing}
                  disabled={loading}
                />
                <button
                  type="button"
                  className="absolute right-3 top-8 text-gray-400 hover:text-gray-600"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5" />
                  ) : (
                    <EyeIcon className="h-5 w-5" />
                  )}
                </button>
              </div>

              <div className="relative">
                <Input
                  label="Confirm Password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  error={errors.confirmPassword}
                  placeholder="Confirm password"
                  required={!isEditing || !!formData.password}
                  disabled={loading}
                />
                <button
                  type="button"
                  className="absolute right-3 top-8 text-gray-400 hover:text-gray-600"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={loading}
                >
                  {showConfirmPassword ? (
                    <EyeSlashIcon className="h-5 w-5" />
                  ) : (
                    <EyeIcon className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {isEditing && (
              <p className="text-sm text-gray-500">
                Leave password fields empty to keep the current password unchanged.
              </p>
            )}
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              loading={loading}
              disabled={loading}
            >
              {isEditing ? 'Update User' : 'Create User'}
            </Button>
          </div>
        </form>
      </Card.Content>
    </Card>
  );
};

export default UserForm;
