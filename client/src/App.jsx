import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Context Providers
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { BugProvider } from './context/BugContext';

// Layout
import Layout from './components/layout/Layout';

// Pages
import Dashboard from './pages/Dashboard';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import BugsPage from './pages/BugsPage';
import BugDetailsPage from './pages/BugDetailsPage';
import CreateBugPage from './pages/CreateBugPage';
import EditBugPage from './pages/EditBugPage';
import UsersPage from './pages/UsersPage';
import ProfilePage from './pages/ProfilePage';
import AnalyticsPage from './pages/AnalyticsPage';

// Auth Components
import ProtectedRoute, { 
  AdminRoute, 
  DeveloperRoute, 
  TesterRoute 
} from './components/auth/ProtectedRoute';

// Styles
import './styles/globals.css';
import './styles/components.css';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BugProvider>
          <Router>
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
              <Routes>
                {/* Public routes */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                {/* Protected routes with layout */}
                <Route path="/" element={
                  <ProtectedRoute>
                    <Layout />
                  </ProtectedRoute>
                }>
                  {/* Dashboard */}
                  <Route index element={<Navigate to="/dashboard" replace />} />
                  <Route path="dashboard" element={<Dashboard />} />

                  {/* Bug Management */}
                  <Route path="bugs">
                    <Route index element={<BugsPage />} />
                    <Route path="new" element={<CreateBugPage />} />
                    <Route path=":id" element={<BugDetailsPage />} />
                    <Route path=":id/edit" element={<EditBugPage />} />
                  </Route>

                  {/* User Management (Admin only) */}
                  <Route path="users" element={
                    <AdminRoute>
                      <UsersPage />
                    </AdminRoute>
                  } />

                  {/* Analytics (Admin & Tester) */}
                  <Route path="analytics" element={
                    <TesterRoute>
                      <AnalyticsPage />
                    </TesterRoute>
                  } />

                  {/* Profile */}
                  <Route path="profile" element={<ProfilePage />} />

                  {/* Catch all - redirect to dashboard */}
                  <Route path="*" element={<Navigate to="/dashboard" replace />} />
                </Route>

                {/* Catch all for non-authenticated users */}
                <Route path="*" element={<Navigate to="/login" replace />} />
              </Routes>

              {/* Toast notifications */}
              <Toaster 
                position="top-right"
                toastOptions={{
                  duration: 4000,
                  style: {
                    background: 'var(--toast-bg, #fff)',
                    color: 'var(--toast-color, #363636)',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                    borderRadius: '8px',
                    border: '1px solid var(--toast-border, #e5e7eb)',
                  },
                  success: {
                    iconTheme: {
                      primary: '#10b981',
                      secondary: '#fff',
                    },
                  },
                  error: {
                    iconTheme: {
                      primary: '#ef4444',
                      secondary: '#fff',
                    },
                  },
                }}
              />
            </div>
          </Router>
        </BugProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
