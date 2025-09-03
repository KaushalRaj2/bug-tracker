export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const USER_ROLES = {
  ADMIN: 'admin',
  DEVELOPER: 'developer',
  TESTER: 'tester',
  REPORTER: 'reporter'
};

export const BUG_STATUS = {
  OPEN: 'open',
  IN_PROGRESS: 'in-progress',
  TESTING: 'testing',
  CLOSED: 'closed',
  REOPENED: 'reopened'
};

export const BUG_PRIORITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical'
};

export const BUG_CATEGORIES = {
  FRONTEND: 'frontend',
  BACKEND: 'backend',
  DATABASE: 'database',
  UI_UX: 'ui/ux',
  PERFORMANCE: 'performance'
};
