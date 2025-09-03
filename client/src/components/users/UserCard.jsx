import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  EnvelopeIcon, 
  CalendarIcon, 
  PencilIcon,
  TrashIcon,
  EllipsisHorizontalIcon
} from '@heroicons/react/24/outline';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import Avatar from '../ui/Avatar';
import Button from '../ui/Button';
import Dropdown from '../ui/Dropdown';
import { formatDateTime, formatUserRole } from '../../utils/formatters';
import { useAuth } from '../../context/AuthContext';

const UserCard = ({ 
  user, 
  onEdit, 
  onDelete, 
  onClick,
  showActions = true,
  className = '' 
}) => {
  const { user: currentUser } = useAuth();
  const [loading, setLoading] = useState(false);

  const canEditUser = () => {
    return currentUser && (
      currentUser.role === 'admin' || 
      currentUser._id === user._id
    );
  };

  const canDeleteUser = () => {
    return currentUser && 
           currentUser.role === 'admin' && 
           currentUser._id !== user._id; // Can't delete self
  };

  const handleEdit = () => {
    if (onEdit) {
      onEdit(user);
    }
  };

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete ${user.name}? This action cannot be undone.`)) {
      setLoading(true);
      try {
        await onDelete(user._id);
      } catch (error) {
        console.error('Failed to delete user:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleCardClick = (e) => {
    if (onClick) {
      e.preventDefault();
      onClick(user);
    }
  };

  const roleColors = {
    admin: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300',
    developer: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300',
    tester: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300',
    reporter: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300'
  };

  const getStatusColor = (isActive) => {
    return isActive 
      ? 'text-green-600 bg-green-100 dark:bg-green-900/20 dark:text-green-400'
      : 'text-red-600 bg-red-100 dark:bg-red-900/20 dark:text-red-400';
  };

  return (
    <Card 
      className={`hover:shadow-md transition-shadow ${onClick ? 'cursor-pointer' : ''} ${className}`}
      onClick={handleCardClick}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-4 flex-1">
          <Avatar
            src={user.avatar}
            alt={user.name}
            size="lg"
            fallback={user.name}
          />
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-1">
              <Link 
                to={`/users/${user._id}`}
                className="text-lg font-semibold text-gray-900 dark:text-white hover:text-blue-600 transition-colors truncate"
                onClick={(e) => e.stopPropagation()}
              >
                {user.name || 'Unknown User'}
              </Link>
              
              {user.isActive !== undefined && (
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(user.isActive)}`}>
                  {user.isActive ? 'Active' : 'Inactive'}
                </span>
              )}
            </div>

            <div className="flex items-center space-x-2 mb-2">
              <Badge className={roleColors[user.role] || roleColors.reporter}>
                {formatUserRole(user.role)}
              </Badge>
            </div>

            <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center space-x-2">
                <EnvelopeIcon className="h-4 w-4 flex-shrink-0" />
                <span className="truncate">{user.email || 'No email'}</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <CalendarIcon className="h-4 w-4 flex-shrink-0" />
                <span>Joined {formatDateTime(user.createdAt)}</span>
              </div>
            </div>

            {/* User Stats */}
            {(user.bugsReported !== undefined || user.bugsAssigned !== undefined) && (
              <div className="mt-3 flex space-x-4 text-sm">
                {user.bugsReported !== undefined && (
                  <div>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {user.bugsReported}
                    </span>
                    <span className="text-gray-500 ml-1">reported</span>
                  </div>
                )}
                
                {user.bugsAssigned !== undefined && (
                  <div>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {user.bugsAssigned}
                    </span>
                    <span className="text-gray-500 ml-1">assigned</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        {showActions && (canEditUser() || canDeleteUser()) && (
          <div className="flex-shrink-0">
            <Dropdown
              trigger={
                <Button variant="ghost" size="sm" disabled={loading}>
                  <EllipsisHorizontalIcon className="h-4 w-4" />
                </Button>
              }
              align="right"
            >
              {canEditUser() && (
                <Dropdown.Item onClick={handleEdit}>
                  <PencilIcon className="h-4 w-4 mr-2" />
                  Edit User
                </Dropdown.Item>
              )}
              
              {canDeleteUser() && (
                <>
                  <Dropdown.Divider />
                  <Dropdown.Item 
                    onClick={handleDelete}
                    className="text-red-600 hover:bg-red-50"
                  >
                    <TrashIcon className="h-4 w-4 mr-2" />
                    Delete User
                  </Dropdown.Item>
                </>
              )}
            </Dropdown>
          </div>
        )}
      </div>
    </Card>
  );
};

export default UserCard;
