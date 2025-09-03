import React from 'react';
import { 
  BugAntIcon, 
  ClockIcon, 
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  UsersIcon
} from '@heroicons/react/24/outline';
import Card from '../ui/Card';
import { formatNumber, formatPercentage } from '../../utils/formatters';

const StatsCards = ({ stats = {}, loading = false }) => {
  const getSafeNumber = (value, fallback = 0) => {
    if (value == null || value === undefined) return fallback;
    const num = Number(value);
    return isNaN(num) || !isFinite(num) ? fallback : Math.floor(num);
  };

  const calculateChange = (current, previous) => {
    const safeCurrent = getSafeNumber(current, 0);
    const safePrevious = getSafeNumber(previous, 1);
    
    if (safePrevious === 0) {
      return { percentage: 0, isIncrease: safeCurrent > 0 };
    }
    
    const change = ((safeCurrent - safePrevious) / safePrevious) * 100;
    
    if (isNaN(change) || !isFinite(change)) {
      return { percentage: 0, isIncrease: false };
    }
    
    return {
      percentage: Math.abs(Math.floor(change)),
      isIncrease: change >= 0
    };
  };

  const overview = stats.overview || {};
  const previous = stats.previous || {};

  const statsData = [
    {
      title: 'Total Bugs',
      value: getSafeNumber(overview.total),
      icon: BugAntIcon,
      color: 'blue',
      change: calculateChange(overview.total, previous.total),
      description: 'All reported bugs'
    },
    {
      title: 'Open Bugs',
      value: getSafeNumber(overview.open),
      icon: ExclamationTriangleIcon,
      color: 'red',
      change: calculateChange(overview.open, previous.open),
      description: 'Bugs awaiting attention'
    },
    {
      title: 'In Progress',
      value: getSafeNumber(overview.inProgress),
      icon: ClockIcon,
      color: 'yellow',
      change: calculateChange(overview.inProgress, previous.inProgress),
      description: 'Bugs being worked on'
    },
    {
      title: 'Resolved',
      value: getSafeNumber(overview.closed),
      icon: CheckCircleIcon,
      color: 'green',
      change: calculateChange(overview.closed, previous.closed),
      description: 'Successfully fixed bugs'
    }
  ];

  const priorityStats = [
    {
      title: 'Critical',
      value: getSafeNumber(overview.critical),
      color: 'red'
    },
    {
      title: 'High',
      value: getSafeNumber(overview.high),
      color: 'orange'
    },
    {
      title: 'Medium',
      value: getSafeNumber(overview.medium),
      color: 'blue'
    },
    {
      title: 'Low',
      value: getSafeNumber(overview.low),
      color: 'gray'
    }
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        {/* Main stats skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <Card.Content className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
                    <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
                  </div>
                  <div className="h-12 w-12 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                </div>
              </Card.Content>
            </Card>
          ))}
        </div>

        {/* Priority stats skeleton */}
        <Card className="animate-pulse">
          <Card.Content className="p-6">
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-32 mb-4"></div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="text-center">
                  <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-16 mx-auto mb-2"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-12 mx-auto"></div>
                </div>
              ))}
            </div>
          </Card.Content>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Main Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsData.map((stat, index) => {
          const Icon = stat.icon;
          const colorClasses = {
            blue: 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
            red: 'bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400',
            yellow: 'bg-yellow-50 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400',
            green: 'bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400'
          };

          return (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <Card.Content className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                      {stat.title}
                    </p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                      {formatNumber(stat.value)}
                    </p>
                    
                    <div className="flex items-center mt-2">
                      {stat.change.isIncrease ? (
                        <ArrowTrendingUpIcon className="h-4 w-4 text-green-500 dark:text-green-400 mr-1" />
                      ) : (
                        <ArrowTrendingDownIcon className="h-4 w-4 text-red-500 dark:text-red-400 mr-1" />
                      )}
                      <span className={`text-sm font-medium ${
                        stat.change.isIncrease 
                          ? 'text-green-600 dark:text-green-400' 
                          : 'text-red-600 dark:text-red-400'
                      }`}>
                        {stat.change.percentage}%
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">vs last month</span>
                    </div>
                    
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {stat.description}
                    </p>
                  </div>
                  
                  <div className={`p-3 rounded-lg ${colorClasses[stat.color]}`}>
                    <Icon className="h-8 w-8" />
                  </div>
                </div>
              </Card.Content>
            </Card>
          );
        })}
      </div>

      {/* Priority Breakdown */}
      <Card>
        <Card.Header>
          <Card.Title className="flex items-center text-gray-900 dark:text-white">
            <ExclamationTriangleIcon className="h-5 w-5 mr-2" />
            Priority Breakdown
          </Card.Title>
        </Card.Header>
        <Card.Content>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {priorityStats.map((priority, index) => {
              const colorClasses = {
                red: 'text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400',
                orange: 'text-orange-600 bg-orange-100 dark:bg-orange-900/30 dark:text-orange-400',
                blue: 'text-blue-600 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400',
                gray: 'text-gray-600 bg-gray-100 dark:bg-gray-900/30 dark:text-gray-400'
              };

              return (
                <div key={index} className="text-center">
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${colorClasses[priority.color]} mb-2`}>
                    <span className="text-2xl font-bold">
                      {formatNumber(priority.value)}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {priority.title}
                  </p>
                </div>
              );
            })}
          </div>
        </Card.Content>
      </Card>
    </div>
  );
};

export default StatsCards;
