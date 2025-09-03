import React from 'react';
import { Link } from 'react-router-dom';
import { 
  PlusIcon,
  BugAntIcon,
  UsersIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  DocumentTextIcon,
  FunnelIcon
} from '@heroicons/react/24/outline';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { useAuth } from '../../context/AuthContext';
import { USER_ROLES } from '../../utils/constants';

const QuickActions = ({ stats = {} }) => {
  const { user } = useAuth();

  const getQuickActions = () => {
    const actions = [];

    // Common actions for all users
    actions.push({
      title: 'Report Bug',
      description: 'Create a new bug report',
      icon: PlusIcon,
      href: '/bugs/new',
      color: 'blue',
      priority: 1
    });

    actions.push({
      title: 'View All Bugs',
      description: 'Browse all bug reports',
      icon: BugAntIcon,
      href: '/bugs',
      color: 'gray',
      priority: 2
    });

    // Role-specific actions
    switch (user?.role) {
      case USER_ROLES.ADMIN:
        actions.push(
          {
            title: 'Manage Users',
            description: 'Add and manage team members',
            icon: UsersIcon,
            href: '/users',
            color: 'purple',
            priority: 3
          },
          {
            title: 'System Analytics',
            description: 'View detailed reports and analytics',
            icon: ChartBarIcon,
            href: '/analytics',
            color: 'green',
            priority: 4
          },
          {
            title: 'System Settings',
            description: 'Configure system preferences',
            icon: Cog6ToothIcon,
            href: '/settings',
            color: 'gray',
            priority: 5
          }
        );
        break;

      case USER_ROLES.DEVELOPER:
        actions.push(
          {
            title: 'My Assigned Bugs',
            description: `${stats.overview?.myAssigned || 0} bugs assigned to you`,
            icon: BugAntIcon,
            href: `/bugs?assignedTo=${user._id}`,
            color: 'blue',
            priority: 3
          },
          {
            title: 'High Priority Bugs',
            description: 'Focus on critical issues',
            icon: FunnelIcon,
            href: '/bugs?priority=critical,high',
            color: 'red',
            priority: 4
          }
        );
        break;

      case USER_ROLES.TESTER:
        actions.push(
          {
            title: 'Bugs in Testing',
            description: `${stats.overview?.testing || 0} bugs ready for testing`,
            icon: DocumentTextIcon,
            href: '/bugs?status=testing',
            color: 'purple',
            priority: 3
          },
          {
            title: 'Ready to Test',
            description: 'Bugs waiting for QA approval',
            icon: FunnelIcon,
            href: '/bugs?status=in-progress',
            color: 'yellow',
            priority: 4
          },
          {
            title: 'Test Analytics',
            description: 'View testing metrics and reports',
            icon: ChartBarIcon,
            href: '/analytics/testing',
            color: 'green',
            priority: 5
          }
        );
        break;

      case USER_ROLES.REPORTER:
        actions.push(
          {
            title: 'My Reported Bugs',
            description: `${stats.overview?.myReported || 0} bugs reported by you`,
            icon: DocumentTextIcon,
            href: `/bugs?reportedBy=${user._id}`,
            color: 'orange',
            priority: 3
          },
          {
            title: 'Bug Templates',
            description: 'Use templates for faster reporting',
            icon: DocumentTextIcon,
            href: '/bugs/templates',
            color: 'gray',
            priority: 4
          }
        );
        break;
    }

    // Sort by priority and return top 6
    return actions.sort((a, b) => a.priority - b.priority).slice(0, 6);
  };

  const quickActions = getQuickActions();

  const getColorClasses = (color) => {
    const colorMap = {
      blue: 'bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400',
      red: 'bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/30 dark:text-red-400',
      green: 'bg-green-50 text-green-600 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-400',
      yellow: 'bg-yellow-50 text-yellow-600 hover:bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-400',
      purple: 'bg-purple-50 text-purple-600 hover:bg-purple-100 dark:bg-purple-900/30 dark:text-purple-400',
      orange: 'bg-orange-50 text-orange-600 hover:bg-orange-100 dark:bg-orange-900/30 dark:text-orange-400',
      gray: 'bg-gray-50 text-gray-600 hover:bg-gray-100 dark:bg-gray-900/30 dark:text-gray-400'
    };
    return colorMap[color] || colorMap.gray;
  };

  return (
    <Card>
      <Card.Header>
        <Card.Title className="text-gray-900 dark:text-white">Quick Actions</Card.Title>
      </Card.Header>
      <Card.Content>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            
            return (
              <Link
                key={index}
                to={action.href}
                className="group block p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-colors"
              >
                <div className="flex items-start space-x-3">
                  <div className={`p-2 rounded-lg transition-colors ${getColorClasses(action.color)}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {action.title}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {action.description}
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Additional contextual actions */}
        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Need help getting started?
            </p>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                <Link to="/help" className="flex items-center">
                  <DocumentTextIcon className="h-4 w-4 mr-1" />
                  Help Guide
                </Link>
              </Button>
              <Button size="sm">
                <Link to="/bugs/new" className="flex items-center">
                  <PlusIcon className="h-4 w-4 mr-1" />
                  Report Bug
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </Card.Content>
    </Card>
  );
};

export default QuickActions;
