import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ClockIcon,
  BugAntIcon,
  UserIcon,
  ChatBubbleLeftIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import Card from '../ui/Card';
import Avatar from '../ui/Avatar';
import Badge from '../ui/Badge';
import { formatTimeAgo, formatBugId } from '../../utils/formatters';

const RecentActivity = ({ activities = [], loading = false }) => {
  const getActivityIcon = (type) => {
    switch (type) {
      case 'bug_created':
        return <BugAntIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />;
      case 'bug_updated':
        return <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />;
      case 'bug_closed':
        return <CheckCircleIcon className="h-5 w-5 text-green-600 dark:text-green-400" />;
      case 'comment_added':
        return <ChatBubbleLeftIcon className="h-5 w-5 text-purple-600 dark:text-purple-400" />;
      case 'bug_assigned':
        return <UserIcon className="h-5 w-5 text-orange-600 dark:text-orange-400" />;
      case 'status_changed':
        return <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />;
      default:
        return <ClockIcon className="h-5 w-5 text-gray-600 dark:text-gray-400" />;
    }
  };

  const getActivityMessage = (activity) => {
    const bugLink = (
      <Link 
        to={`/bugs/${activity.bugId}`}
        className="font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
      >
        {formatBugId ? formatBugId(activity.bugId) : `#${activity.bugId?.slice(-6)}`}
      </Link>
    );

    switch (activity.type) {
      case 'bug_created':
        return (
          <>
            <span className="font-medium text-gray-900 dark:text-white">{activity.user?.name}</span>
            {' '}reported a new bug {bugLink}
          </>
        );
      case 'bug_updated':
        return (
          <>
            <span className="font-medium text-gray-900 dark:text-white">{activity.user?.name}</span>
            {' '}updated bug {bugLink}
            {activity.changes && (
              <span className="text-gray-500 dark:text-gray-400">
                {' '}({activity.changes.join(', ')})
              </span>
            )}
          </>
        );
      case 'bug_closed':
        return (
          <>
            <span className="font-medium text-gray-900 dark:text-white">{activity.user?.name}</span>
            {' '}closed bug {bugLink}
          </>
        );
      case 'comment_added':
        return (
          <>
            <span className="font-medium text-gray-900 dark:text-white">{activity.user?.name}</span>
            {' '}commented on {bugLink}
          </>
        );
      case 'bug_assigned':
        return (
          <>
            <span className="font-medium text-gray-900 dark:text-white">{activity.user?.name}</span>
            {' '}assigned {bugLink} to{' '}
            <span className="font-medium text-gray-900 dark:text-white">{activity.assignedTo?.name}</span>
          </>
        );
      case 'status_changed':
        return (
          <>
            <span className="font-medium text-gray-900 dark:text-white">{activity.user?.name}</span>
            {' '}changed status from {activity.oldValue} to {activity.newValue} for {bugLink}
          </>
        );
      default:
        return (
          <>
            <span className="font-medium text-gray-900 dark:text-white">{activity.user?.name}</span>
            {' '}performed an action on {bugLink}
          </>
        );
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case 'bug_created':
        return 'bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800';
      case 'bug_updated':
        return 'bg-yellow-50 dark:bg-yellow-900/30 border-yellow-200 dark:border-yellow-800';
      case 'bug_closed':
        return 'bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-800';
      case 'comment_added':
        return 'bg-purple-50 dark:bg-purple-900/30 border-purple-200 dark:border-purple-800';
      case 'bug_assigned':
        return 'bg-orange-50 dark:bg-orange-900/30 border-orange-200 dark:border-orange-800';
      case 'status_changed':
        return 'bg-yellow-50 dark:bg-yellow-900/30 border-yellow-200 dark:border-yellow-800';
      default:
        return 'bg-gray-50 dark:bg-gray-900/30 border-gray-200 dark:border-gray-700';
    }
  };

  if (loading) {
    return (
      <Card>
        <Card.Header>
          <Card.Title className="text-gray-900 dark:text-white">Recent Activity</Card.Title>
        </Card.Header>
        <Card.Content>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-start space-x-3 animate-pulse">
                <div className="h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                </div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
              </div>
            ))}
          </div>
        </Card.Content>
      </Card>
    );
  }

  return (
    <Card>
      <Card.Header>
        <div className="flex items-center justify-between">
          <Card.Title className="flex items-center text-gray-900 dark:text-white">
            <ClockIcon className="h-5 w-5 mr-2" />
            Recent Activity
          </Card.Title>
          <Link 
            to="/activity" 
            className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
          >
            View all
          </Link>
        </div>
      </Card.Header>
      <Card.Content>
        {activities.length === 0 ? (
          <div className="text-center py-8">
            <ClockIcon className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No recent activity
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Activity will appear here as team members work on bugs.
            </p>
          </div>
        ) : (
          <div className="flow-root">
            <ul className="-mb-8">
              {activities.map((activity, index) => (
                <li key={activity.id || index}>
                  <div className="relative pb-8">
                    {index !== activities.length - 1 && (
                      <span 
                        className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200 dark:bg-gray-700" 
                        aria-hidden="true" 
                      />
                    )}
                    <div className="relative flex items-start space-x-3">
                      <div className={`relative px-1 ${getActivityColor(activity.type)} rounded-full border-2`}>
                        {getActivityIcon(activity.type)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div>
                          <div className="text-sm text-gray-900 dark:text-white">
                            {getActivityMessage(activity)}
                          </div>
                          <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                            {formatTimeAgo ? formatTimeAgo(activity.createdAt) : 'Recently'}
                          </p>
                        </div>
                        
                        {/* Show bug title if available */}
                        {activity.bugTitle && (
                          <div className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                            <p className="truncate">"{activity.bugTitle}"</p>
                          </div>
                        )}

                        {/* Show comment preview if available */}
                        {activity.type === 'comment_added' && activity.commentPreview && (
                          <div className="mt-2 text-sm text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 rounded p-2">
                            <p className="truncate italic">"{activity.commentPreview}"</p>
                          </div>
                        )}

                        {/* Show priority/status badges if available */}
                        {(activity.priority || activity.status) && (
                          <div className="mt-2 flex space-x-2">
                            {activity.priority && (
                              <Badge variant={activity.priority} size="xs">
                                {activity.priority}
                              </Badge>
                            )}
                            {activity.status && (
                              <Badge variant={activity.status} size="xs">
                                {activity.status.replace('-', ' ')}
                              </Badge>
                            )}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-shrink-0">
                        <Avatar
                          src={activity.user?.avatar}
                          alt={activity.user?.name}
                          fallback={activity.user?.name}
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
      </Card.Content>
    </Card>
  );
};  

export default RecentActivity;
