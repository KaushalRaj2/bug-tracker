import React from 'react';
import { 
  ClockIcon,
  UserIcon,
  BugAntIcon,
  ChatBubbleLeftIcon,
  ArrowRightIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  PencilIcon
} from '@heroicons/react/24/outline';
import Avatar from '../ui/Avatar';
import Badge from '../ui/Badge';
import { formatTimeAgo, formatDateTime } from '../../utils/formatters';

const ActivityTimeline = ({ 
  activities = [], 
  loading = false,
  showAll = false 
}) => {
  const getActivityIcon = (activity) => {
    switch (activity.type) {
      case 'bug_created':
        return (
          <div className="bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 p-2 rounded-full">
            <BugAntIcon className="h-4 w-4" />
          </div>
        );
      case 'status_changed':
        return (
          <div className="bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400 p-2 rounded-full">
            <ArrowRightIcon className="h-4 w-4" />
          </div>
        );
      case 'priority_changed':
        return (
          <div className="bg-orange-100 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400 p-2 rounded-full">
            <ExclamationTriangleIcon className="h-4 w-4" />
          </div>
        );
      case 'assigned':
      case 'unassigned':
        return (
          <div className="bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400 p-2 rounded-full">
            <UserIcon className="h-4 w-4" />
          </div>
        );
      case 'comment_added':
        return (
          <div className="bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400 p-2 rounded-full">
            <ChatBubbleLeftIcon className="h-4 w-4" />
          </div>
        );
      case 'bug_updated':
        return (
          <div className="bg-indigo-100 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400 p-2 rounded-full">
            <PencilIcon className="h-4 w-4" />
          </div>
        );
      case 'bug_closed':
        return (
          <div className="bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400 p-2 rounded-full">
            <CheckCircleIcon className="h-4 w-4" />
          </div>
        );
      default:
        return (
          <div className="bg-gray-100 text-gray-600 dark:bg-gray-900/20 dark:text-gray-400 p-2 rounded-full">
            <ClockIcon className="h-4 w-4" />
          </div>
        );
    }
  };

  const getActivityMessage = (activity) => {
    const userName = activity.user?.name || 'Unknown User';
    
    switch (activity.type) {
      case 'bug_created':
        return (
          <div>
            <span className="font-medium">{userName}</span> created this bug
          </div>
        );
      
      case 'status_changed':
        return (
          <div className="flex items-center space-x-2">
            <span className="font-medium">{userName}</span>
            <span>changed status from</span>
            <Badge variant={activity.oldValue} size="xs">
              {activity.oldValue?.replace('-', ' ')}
            </Badge>
            <span>to</span>
            <Badge variant={activity.newValue} size="xs">
              {activity.newValue?.replace('-', ' ')}
            </Badge>
          </div>
        );
      
      case 'priority_changed':
        return (
          <div className="flex items-center space-x-2">
            <span className="font-medium">{userName}</span>
            <span>changed priority from</span>
            <Badge variant={activity.oldValue} size="xs">
              {activity.oldValue}
            </Badge>
            <span>to</span>
            <Badge variant={activity.newValue} size="xs">
              {activity.newValue}
            </Badge>
          </div>
        );
      
      case 'assigned':
        return (
          <div className="flex items-center space-x-2">
            <span className="font-medium">{userName}</span>
            <span>assigned this bug to</span>
            <div className="flex items-center space-x-1">
              <Avatar 
                src={activity.assignedTo?.avatar} 
                alt={activity.assignedTo?.name}
                size="xs"
              />
              <span className="font-medium">{activity.assignedTo?.name}</span>
            </div>
          </div>
        );
      
      case 'unassigned':
        return (
          <div>
            <span className="font-medium">{userName}</span> unassigned this bug
          </div>
        );
      
      case 'comment_added':
        return (
          <div>
            <span className="font-medium">{userName}</span> added a comment
            {activity.commentPreview && (
              <div className="mt-2 p-2 bg-gray-50 dark:bg-gray-800 rounded text-sm italic border-l-2 border-gray-300">
                "{activity.commentPreview}"
              </div>
            )}
          </div>
        );
      
      case 'bug_updated':
        return (
          <div>
            <span className="font-medium">{userName}</span> updated this bug
            {activity.fieldsChanged && activity.fieldsChanged.length > 0 && (
              <div className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                Changed: {activity.fieldsChanged.join(', ')}
              </div>
            )}
          </div>
        );
      
      case 'bug_closed':
        return (
          <div>
            <span className="font-medium">{userName}</span> closed this bug
            {activity.resolution && (
              <div className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                Resolution: {activity.resolution}
              </div>
            )}
          </div>
        );
      
      default:
        return (
          <div>
            <span className="font-medium">{userName}</span> performed an action
          </div>
        );
    }
  };

  const getActivityTime = (activity) => {
    return (
      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
        {formatTimeAgo(activity.createdAt)}
        <span className="mx-1">•</span>
        {formatDateTime(activity.createdAt, true)}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Activity Timeline
        </h3>
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex space-x-3 animate-pulse">
              <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const displayedActivities = showAll ? activities : activities.slice(0, 10);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
          <ClockIcon className="h-5 w-5 mr-2" />
          Activity Timeline
        </h3>
        {activities.length > 10 && !showAll && (
          <button 
            className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400"
            onClick={() => {/* Handle show all */}}
          >
            Show all ({activities.length})
          </button>
        )}
      </div>

      {activities.length === 0 ? (
        <div className="text-center py-8">
          <ClockIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">
            No activity recorded for this bug yet.
          </p>
        </div>
      ) : (
        <div className="flow-root">
          <ul className="-mb-8">
            {displayedActivities.map((activity, index) => (
              <li key={activity.id || index}>
                <div className="relative pb-8">
                  {/* Timeline connector line */}
                  {index !== displayedActivities.length - 1 && (
                    <span 
                      className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200 dark:bg-gray-700" 
                      aria-hidden="true" 
                    />
                  )}
                  
                  <div className="relative flex space-x-3">
                    {/* Activity Icon */}
                    <div className="relative">
                      {getActivityIcon(activity)}
                    </div>

                    {/* Activity Content */}
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {getActivityMessage(activity)}
                      </div>
                      {getActivityTime(activity)}

                      {/* Additional context */}
                      {activity.metadata && (
                        <div className="mt-2 text-xs text-gray-600 dark:text-gray-400">
                          {activity.metadata.browser && (
                            <span>Browser: {activity.metadata.browser} • </span>
                          )}
                          {activity.metadata.ip && (
                            <span>IP: {activity.metadata.ip}</span>
                          )}
                        </div>
                      )}

                      {/* Attachment info */}
                      {activity.attachmentsAdded && activity.attachmentsAdded.length > 0 && (
                        <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                          Attached {activity.attachmentsAdded.length} file(s):
                          <ul className="mt-1 text-xs">
                            {activity.attachmentsAdded.map((file, idx) => (
                              <li key={idx} className="truncate">• {file.name}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>

                    {/* User Avatar */}
                    <div className="flex-shrink-0">
                      <Avatar
                        src={activity.user?.avatar}
                        alt={activity.user?.name}
                        size="sm"
                      />
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Load more button */}
      {activities.length > 10 && showAll && activities.length > displayedActivities.length && (
        <div className="text-center pt-4 border-t border-gray-200 dark:border-gray-700">
          <button className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400">
            Load more activities
          </button>
        </div>
      )}
    </div>
  );
};

export default ActivityTimeline;
