import React, { useState, useRef } from 'react';
import { 
  UserIcon,
  CameraIcon,
  KeyIcon,
  Cog6ToothIcon
} from '@heroicons/react/24/outline';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Avatar from '../components/ui/Avatar';
import Modal from '../components/ui/Modal';
import Badge from '../components/ui/Badge';
import { useAuth } from '../context/AuthContext';
import { formatDateTime, formatUserRole } from '../utils/formatters';
import { authService } from '../services/authService';
import toast from 'react-hot-toast';

const ProfilePage = () => {
  const { user, updateUser } = useAuth();
  const fileInputRef = useRef(null);
  const [editing, setEditing] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [profileImage, setProfileImage] = useState(user?.avatar || null);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || ''
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear errors
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handlePasswordInputChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image must be less than 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        setProfileImage(event.target.result);
        toast.success('Profile picture updated');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setLoading(true);
      const updatedUser = {
        ...user,
        name: formData.name.trim(),
        email: formData.email.trim(),
        avatar: profileImage
      };
      
      updateUser(updatedUser);
      setEditing(false);
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }

    try {
      setLoading(true);
      await authService.changePassword(
        passwordData.currentPassword,
        passwordData.newPassword
      );
      
      toast.success('Password changed successfully');
      setShowPasswordModal(false);
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      toast.error(error.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || ''
    });
    setProfileImage(user?.avatar || null);
    setEditing(false);
    setErrors({});
  };

  const roleColors = {
    admin: 'primary',
    developer: 'info', 
    tester: 'success',
    reporter: 'default'
  };

  const getRoleVariant = (role) => {
    return roleColors[role] || 'default';
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Profile Settings
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage your account settings and preferences
          </p>
        </div>

        {/* Profile Card */}
        <Card>
          <Card.Header>
            <div className="flex items-center justify-between">
              <Card.Title className="flex items-center">
                <UserIcon className="h-5 w-5 mr-2" />
                Personal Information
              </Card.Title>
              {!editing && (
                <Button
                  variant="outline"
                  onClick={() => setEditing(true)}
                >
                  Edit Profile
                </Button>
              )}
            </div>
          </Card.Header>

          <Card.Content>
            {!editing ? (
              <div className="space-y-6">
                {/* ✅ FIXED Avatar Section */}
                <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
                  <div className="relative flex-shrink-0">
                    <Avatar
                      src={profileImage}
                      size="2xl"
                      fallback={user.name}
                      className="ring-4 ring-gray-100 dark:ring-gray-700 shadow-lg"
                    />
                    {/* Online status indicator */}
                    <div className="absolute bottom-1 right-1 w-6 h-6 bg-green-400 rounded-full border-4 border-white dark:border-gray-800 shadow-md"></div>
                  </div>
                  
                  <div className="flex-1 min-w-0 space-y-3">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white truncate">
                        {user.name}
                      </h3>
                      <p className="text-lg text-gray-600 dark:text-gray-400 truncate">
                        {user.email}
                      </p>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-3">
                      <Badge 
                        variant={getRoleVariant(user.role)}
                        size="default"
                        className="capitalize font-medium"
                      >
                        {formatUserRole(user.role)}
                      </Badge>
                      
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                        <span className="text-sm text-green-600 dark:text-green-400 font-medium">Online</span>
                      </div>
                      
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        Member since {new Date(user.createdAt).getFullYear()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Profile Information Grid */}
                <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block">
                        Full Name
                      </label>
                      <p className="text-gray-900 dark:text-white font-medium break-words">
                        {user.name}
                      </p>
                    </div>
                    
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block">
                        Email Address  
                      </label>
                      <p className="text-gray-900 dark:text-white font-medium break-all">
                        {user.email}
                      </p>
                    </div>
                    
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block">
                        Role
                      </label>
                      <div>
                        <Badge 
                          variant={getRoleVariant(user.role)}
                          className="capitalize"
                        >
                          {formatUserRole(user.role)}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block">
                        Member Since
                      </label>
                      <p className="text-gray-900 dark:text-white font-medium">
                        {formatDateTime(user.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <form onSubmit={handleProfileSubmit} className="space-y-6">
                {/* ✅ FIXED Editing Avatar Section */}
                <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-6 mb-6">
                  <div className="relative flex-shrink-0">
                    <Avatar
                      src={profileImage}
                      size="2xl"
                      fallback={user.name}
                      onClick={() => fileInputRef.current?.click()}
                      className="cursor-pointer ring-4 ring-blue-100 dark:ring-blue-900 shadow-lg hover:ring-blue-200 dark:hover:ring-blue-800 transition-all duration-200"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute bottom-1 right-1 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-2 shadow-lg transition-colors duration-200 ring-4 ring-white dark:ring-gray-800"
                    >
                      <CameraIcon className="h-4 w-4" />
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      <p className="font-medium">Click to change profile picture</p>
                      <p className="text-xs mt-1">Max file size: 5MB. Formats: JPG, PNG, GIF</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="Full Name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    error={errors.name}
                    required
                    disabled={loading}
                    className="font-medium"
                  />
                  <Input
                    label="Email Address"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    error={errors.email}
                    required
                    disabled={loading}
                    className="font-medium"
                  />
                </div>

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
                    Save Changes
                  </Button>
                </div>
              </form>
            )}
          </Card.Content>
        </Card>

        {/* Security Settings */}
        <Card>
          <Card.Header>
            <Card.Title className="flex items-center">
              <KeyIcon className="h-5 w-5 mr-2" />
              Security Settings
            </Card.Title>
          </Card.Header>
          <Card.Content>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                    Password
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                    Last updated {formatDateTime(user.passwordChangedAt || user.createdAt)}
                  </p>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setShowPasswordModal(true)}
                  className="flex-shrink-0 ml-4"
                >
                  Change Password
                </Button>
              </div>
            </div>
          </Card.Content>
        </Card>

        {/* Account Stats */}
        <Card>
          <Card.Header>
            <Card.Title className="flex items-center">
              <Cog6ToothIcon className="h-5 w-5 mr-2" />
              Account Statistics
            </Card.Title>
          </Card.Header>
          <Card.Content>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {user.bugsReported || 0}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">Bugs Reported</div>
              </div>
              <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {user.bugsResolved || 0}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">Bugs Resolved</div>
              </div>
              <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {user.commentsCount || 0}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">Comments</div>
              </div>
              <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                  {user.activeDays || 0}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">Active Days</div>
              </div>
            </div>
          </Card.Content>
        </Card>

        {/* Password Change Modal */}
        <Modal
          isOpen={showPasswordModal}
          onClose={() => {
            setShowPasswordModal(false);
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
          }}
          title="Change Password"
          size="md"
        >
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <Input
              label="Current Password"
              type="password"
              name="currentPassword"
              value={passwordData.currentPassword}
              onChange={handlePasswordInputChange}
              required
              disabled={loading}
            />
            <Input
              label="New Password"
              type="password"
              name="newPassword"
              value={passwordData.newPassword}
              onChange={handlePasswordInputChange}
              required
              disabled={loading}
            />
            <Input
              label="Confirm New Password"
              type="password"
              name="confirmPassword"
              value={passwordData.confirmPassword}
              onChange={handlePasswordInputChange}
              required
              disabled={loading}
            />
            
            <div className="flex justify-end space-x-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowPasswordModal(false);
                  setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                }}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                loading={loading}
                disabled={loading}
              >
                Change Password
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </div>
  );
};

export default ProfilePage;
