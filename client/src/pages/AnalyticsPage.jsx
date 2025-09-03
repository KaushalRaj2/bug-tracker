import React, { useState, useEffect } from 'react';
import { 
  ChartBarIcon,
  CalendarIcon,
  UsersIcon,
  BugAntIcon,
  ClockIcon,
ArrowTrendingUpIcon,   
  ArrowTrendingDownIcon  
} from '@heroicons/react/24/outline';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Select from '../components/ui/Select';
import BugChart from '../components/dashboard/BugChart';
import DataTable from '../components/ui/DataTable';
import { useAuth } from '../context/AuthContext';
import { bugService } from '../services/bugService';
import { formatNumber, formatPercentage } from '../utils/formatters';
import { USER_ROLES } from '../utils/constants';

const AnalyticsPage = () => {
  const { user } = useAuth();
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState('30'); // days
  const [selectedMetric, setSelectedMetric] = useState('bugs');

  useEffect(() => {
    loadAnalyticsData();
  }, [timeRange]);

  // Check if user has access to analytics
  const canViewAnalytics = () => {
    return user && (user.role === USER_ROLES.ADMIN || user.role === USER_ROLES.TESTER);
  };

  const loadAnalyticsData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Mock analytics data - in real app, this would come from API
      const mockData = {
        overview: {
          totalBugs: 156,
          activeBugs: 23,
          resolvedThisMonth: 45,
          avgResolutionTime: 3.2,
          bugVelocity: 12.5,
          teamProductivity: 78
        },
        trends: {
          bugsCreated: [12, 19, 15, 25, 22, 18, 24],
          bugsResolved: [8, 15, 12, 20, 18, 16, 22],
          labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6', 'Week 7']
        },
        performance: {
          developers: [
            { name: 'John Doe', bugsResolved: 24, avgTime: 2.8, efficiency: 92 },
            { name: 'Jane Smith', bugsResolved: 18, avgTime: 3.1, efficiency: 87 },
            { name: 'Mike Johnson', bugsResolved: 15, avgTime: 4.2, efficiency: 76 }
          ],
          categories: [
            { name: 'Frontend', count: 45, percentage: 28.8 },
            { name: 'Backend', count: 38, percentage: 24.4 },
            { name: 'Database', count: 29, percentage: 18.6 },
            { name: 'UI/UX', count: 25, percentage: 16.0 },
            { name: 'Performance', count: 19, percentage: 12.2 }
          ]
        },
        timeMetrics: {
          avgResolutionTime: 3.2,
          medianResolutionTime: 2.1,
          fastestResolution: 0.5,
          slowestResolution: 15.2
        }
      };

      setAnalyticsData(mockData);
    } catch (error) {
      console.error('Failed to load analytics:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!canViewAnalytics()) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <Card className="max-w-md text-center py-12">
          <ChartBarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Access Denied
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            You don't have permission to view analytics. Contact your administrator if you believe this is an error.
          </p>
          <Button onClick={() => window.history.back()}>
            Go Back
          </Button>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-6">
            {/* Header Skeleton */}
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
            
            {/* Cards Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg p-6 animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <Card className="max-w-md text-center py-12">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Failed to Load Analytics
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
          <Button onClick={loadAnalyticsData}>
            Try Again
          </Button>
        </Card>
      </div>
    );
  }

  const performanceColumns = [
    {
      header: 'Developer',
      accessor: 'name',
      render: (row) => (
        <div className="flex items-center">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
            <span className="text-sm font-medium text-blue-600">
              {row.name.split(' ').map(n => n[0]).join('')}
            </span>
          </div>
          <span className="font-medium">{row.name}</span>
        </div>
      )
    },
    {
      header: 'Bugs Resolved',
      accessor: 'bugsResolved',
      render: (row) => (
        <span className="font-semibold text-green-600">{row.bugsResolved}</span>
      )
    },
    {
      header: 'Avg Resolution Time',
      accessor: 'avgTime',
      render: (row) => (
        <span>{row.avgTime} days</span>
      )
    },
    {
      header: 'Efficiency',
      accessor: 'efficiency',
      render: (row) => (
        <div className="flex items-center">
          <div className="w-full bg-gray-200 rounded-full h-2 mr-2">
            <div 
              className="bg-blue-600 h-2 rounded-full" 
              style={{ width: `${row.efficiency}%` }}
            ></div>
          </div>
          <span className="text-sm font-medium">{row.efficiency}%</span>
        </div>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
              <ChartBarIcon className="h-8 w-8 mr-3" />
              Analytics Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Comprehensive insights into bug tracking performance and team productivity
            </p>
          </div>

          <div className="flex items-center space-x-4">
            <Select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="w-40"
            >
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 90 days</option>
              <option value="365">Last year</option>
            </Select>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <Card.Content className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Bugs</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {formatNumber(analyticsData.overview.totalBugs)}
                </p>
                <div className="flex items-center mt-1">
                  <ArrowTrendingUpIcon className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600">+12%</span>
                  <span className="text-sm text-gray-500 ml-1">vs last period</span>
                </div>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <BugAntIcon className="h-8 w-8 text-blue-600" />
              </div>
            </Card.Content>
          </Card>

          <Card>
            <Card.Content className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Bugs</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {formatNumber(analyticsData.overview.activeBugs)}
                </p>
                <div className="flex items-center mt-1">
                  <ArrowTrendingDownIcon className="h-4 w-4 text-red-500 mr-1" />
                  <span className="text-sm text-red-600">-8%</span>
                  <span className="text-sm text-gray-500 ml-1">vs last period</span>
                </div>
              </div>
              <div className="p-3 bg-red-100 rounded-full">
                <ClockIcon className="h-8 w-8 text-red-600" />
              </div>
            </Card.Content>
          </Card>

          <Card>
            <Card.Content className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg Resolution Time</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {analyticsData.overview.avgResolutionTime} days
                </p>
                <div className="flex items-center mt-1">
                  <ArrowTrendingDownIcon className="h-4 w-4 text-red-500 mr-1" />
                  <span className="text-sm text-green-600">-15%</span>
                  <span className="text-sm text-gray-500 ml-1">improvement</span>
                </div>
              </div>
              <div className="p-3 bg-yellow-100 rounded-full">
                <CalendarIcon className="h-8 w-8 text-yellow-600" />
              </div>
            </Card.Content>
          </Card>

          <Card>
            <Card.Content className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Team Productivity</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {analyticsData.overview.teamProductivity}%
                </p>
                <div className="flex items-center mt-1">
                  <ArrowTrendingUpIcon className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600">+5%</span>
                  <span className="text-sm text-gray-500 ml-1">this month</span>
                </div>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <UsersIcon className="h-8 w-8 text-green-600" />
              </div>
            </Card.Content>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <BugChart 
            type="trend" 
            data={{ trendData: analyticsData.trends }}
            title="Bug Creation vs Resolution Trends"
            height={300}
          />
          
          <Card>
            <Card.Header>
              <Card.Title>Bug Categories Distribution</Card.Title>
            </Card.Header>
            <Card.Content>
              <div className="space-y-4">
                {analyticsData.performance.categories.map((category, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {category.name}
                    </span>
                    <div className="flex items-center space-x-3">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${category.percentage}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-600 w-12 text-right">
                        {category.count}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </Card.Content>
          </Card>
        </div>

        {/* Performance Table */}
        <Card>
          <Card.Header>
            <Card.Title>Developer Performance</Card.Title>
          </Card.Header>
          <Card.Content>
            <DataTable
              data={analyticsData.performance.developers}
              columns={performanceColumns}
              emptyMessage="No performance data available"
            />
          </Card.Content>
        </Card>

        {/* Time Metrics */}
        <Card>
          <Card.Header>
            <Card.Title>Resolution Time Analysis</Card.Title>
          </Card.Header>
          <Card.Content>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">
                  {analyticsData.timeMetrics.avgResolutionTime}
                </p>
                <p className="text-sm text-gray-500">Average (days)</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">
                  {analyticsData.timeMetrics.medianResolutionTime}
                </p>
                <p className="text-sm text-gray-500">Median (days)</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-emerald-600">
                  {analyticsData.timeMetrics.fastestResolution}
                </p>
                <p className="text-sm text-gray-500">Fastest (days)</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-red-600">
                  {analyticsData.timeMetrics.slowestResolution}
                </p>
                <p className="text-sm text-gray-500">Slowest (days)</p>
              </div>
            </div>
          </Card.Content>
        </Card>
      </div>
    </div>
  );
};

export default AnalyticsPage;
