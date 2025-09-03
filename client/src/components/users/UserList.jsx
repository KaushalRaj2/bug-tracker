import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  XMarkIcon,
  UsersIcon
} from '@heroicons/react/24/outline';
import UserCard from './UserCard';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import { useUsers } from '../../hooks/useUsers';
import { useAuth } from '../../context/AuthContext';
import { USER_ROLES } from '../../utils/constants';

const UserList = ({ 
  onUserEdit, 
  onUserDelete,
  showCreateButton = true 
}) => {
  const { users, loading, error, fetchUsers, deleteUser } = useUsers();
  const { user: currentUser } = useAuth();
  const [filters, setFilters] = useState({
    search: '',
    role: '',
    status: '',
    sortBy: 'name'
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Filter and sort users
  const filteredUsers = useMemo(() => {
    if (!users) return [];

    let filtered = users.filter(user => {
      const matchesSearch = !filters.search || 
        user.name?.toLowerCase().includes(filters.search.toLowerCase()) ||
        user.email?.toLowerCase().includes(filters.search.toLowerCase());

      const matchesRole = !filters.role || user.role === filters.role;
      
      const matchesStatus = !filters.status || 
        (filters.status === 'active' && user.isActive !== false) ||
        (filters.status === 'inactive' && user.isActive === false);

      return matchesSearch && matchesRole && matchesStatus;
    });

    // Sort users
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case 'name':
          return (a.name || '').localeCompare(b.name || '');
        case 'email':
          return (a.email || '').localeCompare(b.email || '');
        case 'role':
          return (a.role || '').localeCompare(b.role || '');
        case 'created':
          return new Date(b.createdAt) - new Date(a.createdAt);
        default:
          return 0;
      }
    });

    return filtered;
  }, [users, filters]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      role: '',
      status: '',
      sortBy: 'name'
    });
  };

  const getActiveFilterCount = () => {
    return Object.entries(filters).filter(([key, value]) => 
      key !== 'sortBy' && value !== ''
    ).length;
  };

  const handleUserDelete = async (userId) => {
    try {
      await deleteUser(userId);
      if (onUserDelete) {
        onUserDelete(userId);
      }
    } catch (error) {
      console.error('Failed to delete user:', error);
    }
  };

  // Get user stats for display
  const userStats = useMemo(() => {
    if (!users) return { total: 0, active: 0, byRole: {} };

    const stats = {
      total: users.length,
      active: users.filter(user => user.isActive !== false).length,
      byRole: {}
    };

    users.forEach(user => {
      stats.byRole[user.role] = (stats.byRole[user.role] || 0) + 1;
    });

    return stats;
  }, [users]);

  const canManageUsers = () => {
    return currentUser?.role === 'admin';
  };

  if (loading && (!users || users.length === 0)) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="h-8 bg-gray-200 rounded w-48"></div>
          <div className="h-10 bg-gray-200 rounded w-32"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg border p-6 animate-pulse">
              <div className="flex items-start space-x-4">
                <div className="h-12 w-12 bg-gray-200 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 text-lg font-semibold mb-2">
          Error Loading Users
        </div>
        <p className="text-gray-600 mb-4">{error}</p>
        <Button onClick={() => fetchUsers()}>
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
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Team Members
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {filteredUsers.length} of {userStats.total} users
          </p>
        </div>

        {showCreateButton && canManageUsers() && (
          <Link to="/users/new">
            <Button>
              <PlusIcon className="h-4 w-4 mr-2" />
              Add User
            </Button>
          </Link>
        )}
      </div>

      {/* User Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {userStats.total}
          </div>
          <div className="text-sm text-gray-500">Total Users</div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="text-2xl font-bold text-green-600">
            {userStats.active}
          </div>
          <div className="text-sm text-gray-500">Active Users</div>
        </div>

        {Object.entries(userStats.byRole).map(([role, count]) => (
          <div key={role} className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <div className="text-2xl font-bold text-blue-600">
              {count}
            </div>
            <div className="text-sm text-gray-500 capitalize">
              {role.replace('-', ' ')}s
            </div>
          </div>
        ))}
      </div>

      {/* Search and Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search users by name or email..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Filter Toggle */}
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
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

        {/* Advanced Filters */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Select
                label="Role"
                value={filters.role}
                onChange={(e) => handleFilterChange('role', e.target.value)}
              >
                <option value="">All Roles</option>
                <option value={USER_ROLES.ADMIN}>Administrator</option>
                <option value={USER_ROLES.DEVELOPER}>Developer</option>
                <option value={USER_ROLES.TESTER}>QA Tester</option>
                <option value={USER_ROLES.REPORTER}>Bug Reporter</option>
              </Select>

              <Select
                label="Status"
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
              >
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </Select>

              <Select
                label="Sort By"
                value={filters.sortBy}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
              >
                <option value="name">Name</option>
                <option value="email">Email</option>
                <option value="role">Role</option>
                <option value="created">Date Created</option>
              </Select>

              <div className="flex items-end">
                {getActiveFilterCount() > 0 && (
                  <Button
                    variant="outline"
                    onClick={clearFilters}
                    className="w-full"
                  >
                    <XMarkIcon className="h-4 w-4 mr-2" />
                    Clear
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* User Grid */}
      {filteredUsers.length === 0 ? (
        <div className="text-center py-12">
          <UsersIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            {getActiveFilterCount() > 0 ? 'No users match your filters' : 'No users found'}
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            {getActiveFilterCount() > 0 ? 
              'Try adjusting your search criteria.' :
              'Get started by adding your first team member.'
            }
          </p>
          {getActiveFilterCount() > 0 ? (
            <Button variant="outline" onClick={clearFilters}>
              Clear Filters
            </Button>
          ) : canManageUsers() && (
            <Link to="/users/new">
              <Button>
                <PlusIcon className="h-4 w-4 mr-2" />
                Add First User
              </Button>
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUsers.map((user) => (
            <UserCard
              key={user._id}
              user={user}
              onEdit={onUserEdit}
              onDelete={handleUserDelete}
              showActions={canManageUsers()}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default UserList;
