import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { USER_ROLES } from '../../utils/constants';

const DashboardLayout = ({ children }) => {
  const { user } = useAuth();

  const getWelcomeMessage = () => {
    const hour = new Date().getHours();
    let greeting;
    
    if (hour < 12) greeting = 'Good morning';
    else if (hour < 18) greeting = 'Good afternoon';
    else greeting = 'Good evening';

    return `${greeting}, ${user?.name || 'User'}!`;
  };

  const getRoleMessage = () => {
    switch (user?.role) {
      case USER_ROLES.ADMIN:
        return "Here's your complete system overview and management tools.";
      case USER_ROLES.DEVELOPER:
        return "Here are your assigned bugs and development tasks.";
      case USER_ROLES.TESTER:
        return "Here are bugs ready for testing and quality assurance.";
      case USER_ROLES.REPORTER:
        return "Track your reported bugs and their current status.";
      default:
        return "Welcome to your bug tracking dashboard.";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {getWelcomeMessage()}
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            {getRoleMessage()}
          </p>
        </div>

        {/* Dashboard Content */}
        <div className="space-y-8">
          {children}
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
