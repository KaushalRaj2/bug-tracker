import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ClockIcon, 
  UserIcon, 
  ChatBubbleLeftIcon,
  PaperClipIcon 
} from '@heroicons/react/24/outline';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import Avatar from '../ui/Avatar';
import { formatDateTime, formatBugId, formatText } from '../../utils/formatters';

const BugCard = ({ 
  bug, 
  onClick, 
  showActions = true,
  className = ''
}) => {
  const priorityColors = {
    low: 'text-gray-600',
    medium: 'text-blue-600',
    high: 'text-orange-600',
    critical: 'text-red-600'
  };

  const statusColors = {
    open: 'text-blue-600',
    'in-progress': 'text-yellow-600',
    testing: 'text-purple-600',
    closed: 'text-green-600',
    reopened: 'text-orange-600'
  };

  const handleCardClick = (e) => {
    if (onClick) {
      e.preventDefault();
      onClick(bug);
    }
  };

  return (
    <Card 
      className={`hover:shadow-md transition-shadow cursor-pointer ${className}`}
      onClick={handleCardClick}
      padding="default"
    >
      <div className="space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 text-sm text-gray-500 mb-1">
              <span className="font-medium">{formatBugId(bug._id)}</span>
              <span>•</span>
              <Badge variant={bug.priority} size="xs">
                {bug.priority}
              </Badge>
              <Badge variant={bug.status} size="xs">
                {bug.status?.replace('-', ' ')}
              </Badge>
            </div>
            
            <Link 
              to={`/bugs/${bug._id}`}
              className="block group"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                {bug.title}
              </h3>
            </Link>
          </div>

          <div className={`w-3 h-3 rounded-full ${priorityColors[bug.priority]} bg-current opacity-20`} />
        </div>

        {/* Description */}
        <p className="text-gray-600 text-sm line-clamp-3">
          {formatText(bug.description, 150)}
        </p>

        {/* Tags */}
        {bug.tags && bug.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {bug.tags.slice(0, 3).map((tag, index) => (
              <span 
                key={index}
                className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700"
              >
                {tag}
              </span>
            ))}
            {bug.tags.length > 3 && (
              <span className="text-xs text-gray-500">
                +{bug.tags.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            {/* Assignee */}
            {bug.assignedTo && (
              <div className="flex items-center space-x-1">
                <Avatar 
                  src={bug.assignedTo.avatar} 
                  alt={bug.assignedTo.name}
                  size="xs"
                />
                <span>{bug.assignedTo.name}</span>
              </div>
            )}

            {/* Comments count */}
            {bug.comments && bug.comments.length > 0 && (
              <div className="flex items-center space-x-1">
                <ChatBubbleLeftIcon className="h-4 w-4" />
                <span>{bug.comments.length}</span>
              </div>
            )}

            {/* Attachments count */}
            {bug.attachments && bug.attachments.length > 0 && (
              <div className="flex items-center space-x-1">
                <PaperClipIcon className="h-4 w-4" />
                <span>{bug.attachments.length}</span>
              </div>
            )}
          </div>

          {/* Created date */}
          <div className="flex items-center space-x-1 text-sm text-gray-500">
            <ClockIcon className="h-4 w-4" />
            <span>{formatDateTime(bug.createdAt)}</span>
          </div>
        </div>

        {/* Reporter info */}
        <div className="flex items-center space-x-2 text-xs text-gray-500">
          <UserIcon className="h-3 w-3" />
          <span>Reported by {bug.reportedBy?.name || 'Unknown'}</span>
        </div>
      </div>
    </Card>
  );
};

export default BugCard;
