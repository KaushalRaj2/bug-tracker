import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UserList from '../components/users/UserList';
import UserForm from '../components/users/UserForm';
import Modal from '../components/ui/Modal';
import { useAuth } from '../context/AuthContext';
import { USER_ROLES } from '../utils/constants';

const UsersPage = () => {
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserForm, setShowUserForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Check if user has permission to access users page
  if (currentUser?.role !== USER_ROLES.ADMIN) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Access Denied
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            You don't have permission to access user management.
          </p>
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const handleUserEdit = (user) => {
    setSelectedUser(user);
    setIsEditing(true);
    setShowUserForm(true);
  };

  const handleUserDelete = (userId) => {
    // UserList component handles the deletion
    console.log('User deleted:', userId);
  };

  const handleFormSubmit = (savedUser) => {
    setShowUserForm(false);
    setSelectedUser(null);
    setIsEditing(false);
    // List will refresh automatically through the hook
  };

  const handleFormCancel = () => {
    setShowUserForm(false);
    setSelectedUser(null);
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <UserList
          onUserEdit={handleUserEdit}
          onUserDelete={handleUserDelete}
        />

        {/* User Form Modal */}
        <Modal
          isOpen={showUserForm}
          onClose={handleFormCancel}
          title={isEditing ? 'Edit User' : 'Add New User'}
          size="lg"
        >
          <UserForm
            user={selectedUser}
            isEditing={isEditing}
            onSubmit={handleFormSubmit}
            onCancel={handleFormCancel}
          />
        </Modal>
      </div>
    </div>
  );
};

export default UsersPage;
