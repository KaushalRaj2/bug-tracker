import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { USER_ROLES } from '../../utils/constants';

const ProtectedRoute = ({ 
  children, 
  requiredRoles = [], 
  fallbackPath = '/login',
  showUnauthorized = false 
}) => {
  const { user, loading, isAuthenticated } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated || !user) {
    return (
      <Navigate 
        to={fallbackPath} 
        state={{ from: location.pathname }} 
        replace 
      />
    );
  }

  // Check role-based access if required roles are specified
  if (requiredRoles.length > 0 && !requiredRoles.includes(user.role)) {
    if (showUnauthorized) {
      return <UnauthorizedAccess />;
    }
    
    // Redirect based on user role
    const roleRedirects = {
      [USER_ROLES.ADMIN]: '/dashboard',
      [USER_ROLES.DEVELOPER]: '/dashboard', 
      [USER_ROLES.TESTER]: '/dashboard',
      [USER_ROLES.REPORTER]: '/dashboard'
    };
    
    return (
      <Navigate 
        to={roleRedirects[user.role] || '/dashboard'} 
        replace 
      />
    );
  }

  // User is authenticated and authorized
  return children;
};

// Unauthorized access component
const UnauthorizedAccess = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8 text-center">
      <div className="mb-4">
        <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
          <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
      </div>
      <h2 className="text-xl font-semibold text-gray-900 mb-2">Access Denied</h2>
      <p className="text-gray-600 mb-6">
        You don't have permission to access this page. Please contact your administrator if you believe this is an error.
      </p>
      <button
        onClick={() => window.history.back()}
        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
      >
        Go Back
      </button>
    </div>
  </div>
);

// HOC for creating role-specific protected routes
export const createRoleProtectedRoute = (requiredRoles) => {
  return ({ children, ...props }) => (
    <ProtectedRoute requiredRoles={requiredRoles} {...props}>
      {children}
    </ProtectedRoute>
  );
};

// Pre-configured role-based routes
export const AdminRoute = createRoleProtectedRoute([USER_ROLES.ADMIN]);
export const DeveloperRoute = createRoleProtectedRoute([USER_ROLES.DEVELOPER, USER_ROLES.ADMIN]);
export const TesterRoute = createRoleProtectedRoute([USER_ROLES.TESTER, USER_ROLES.ADMIN]);
export const ReporterRoute = createRoleProtectedRoute([USER_ROLES.REPORTER, USER_ROLES.ADMIN]);

// Multi-role routes
export const DevTesterRoute = createRoleProtectedRoute([
  USER_ROLES.DEVELOPER, 
  USER_ROLES.TESTER, 
  USER_ROLES.ADMIN
]);

export const AllRolesRoute = createRoleProtectedRoute([
  USER_ROLES.ADMIN,
  USER_ROLES.DEVELOPER,
  USER_ROLES.TESTER,
  USER_ROLES.REPORTER
]);

export default ProtectedRoute;
