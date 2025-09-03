import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PlusIcon } from '@heroicons/react/24/outline';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import StatsCards from '../components/dashboard/StatsCards';
import BugChart from '../components/dashboard/BugChart';
import RecentActivity from '../components/dashboard/RecentActivity';
import QuickActions from '../components/dashboard/QuickActions';
import Button from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';
import { useBugs } from '../context/BugContext';
import { bugService } from '../services/bugService';
import { USER_ROLES } from '../utils/constants';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const { user } = useAuth();
  const { bugs, fetchBugs } = useBugs();
  const [stats, setStats] = useState(null);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadDashboardData();
  }, [user]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load stats
      const statsResponse = await bugService.getStats();
      setStats(statsResponse);

      // Load recent bugs based on user role
      const bugsFilter = { limit: 5, page: 1 };
      
      if (user?.role === USER_ROLES.REPORTER) {
        bugsFilter.reportedBy = user._id;
      } else if (user?.role === USER_ROLES.DEVELOPER) {
        bugsFilter.assignedTo = user._id;
      }

      await fetchBugs(bugsFilter);

      // Mock recent activity - in real app, this would come from API
      const mockActivity = [
        {
          id: 1,
          type: 'bug_created',
          user: { name: 'John Doe', avatar: null },
          bugId: '507f1f77bcf86cd799439011',
          bugTitle: 'Login form validation issue',
          createdAt: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
          priority: 'high'
        },
        {
          id: 2,
          type: 'status_changed',
          user: { name: 'Jane Smith', avatar: null },
          bugId: '507f1f77bcf86cd799439012',
          bugTitle: 'Dashboard loading slow',
          oldValue: 'open',
          newValue: 'in-progress',
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
        },
        {
          id: 3,
          type: 'comment_added',
          user: { name: 'Mike Johnson', avatar: null },
          bugId: '507f1f77bcf86cd799439013',
          bugTitle: 'Mobile responsive issues',
          commentPreview: 'I found the root cause of this issue...',
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 4), // 4 hours ago
        }
      ];
      
      setRecentActivity(mockActivity);

    } catch (error) {
      console.error('Dashboard load error:', error);
      setError(error.message);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const getRoleBasedContent = () => {
    switch (user?.role) {
      case USER_ROLES.ADMIN:
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <BugChart type="status" data={stats} title="Bug Status Overview" />
            <BugChart type="priority" data={stats} title="Priority Distribution" />
          </div>
        );
      
      case USER_ROLES.TESTER:
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <BugChart type="status" data={stats} title="Testing Pipeline" />
            <BugChart type="trend" data={stats} title="Bug Resolution Trends" />
          </div>
        );
      
      default:
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <BugChart type="status" data={stats} />
            <RecentActivity activities={recentActivity} loading={loading} />
          </div>
        );
    }
  };

  if (loading && !stats) {
    return (
      <DashboardLayout>
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-lg p-6 animate-pulse border border-gray-200 dark:border-gray-700">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 h-64 animate-pulse border border-gray-200 dark:border-gray-700">
              <div className="h-full bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 h-64 animate-pulse border border-gray-200 dark:border-gray-700">
              <div className="h-full bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <div className="text-red-600 dark:text-red-400 text-lg font-semibold mb-2">
            Dashboard Load Error
          </div>
          <p className="text-gray-600 dark:text-gray-300 mb-4">{error}</p>
          <Button onClick={loadDashboardData}>
            Retry
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      {/* Quick Action Bar */}
      <div className="flex justify-end mb-6">
        <Link to="/bugs/new">
          <Button>
            <PlusIcon className="h-4 w-4 mr-2" />
            Report Bug
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <StatsCards stats={stats} loading={loading} />

      {/* Role-based Charts */}
      {getRoleBasedContent()}

      {/* Quick Actions */}
      <QuickActions stats={stats} />
    </DashboardLayout>
  );
};

export default Dashboard;
