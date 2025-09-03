import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { clsx } from 'clsx';
import { 
  HomeIcon,
  BugAntIcon,
  UsersIcon,
  ChartBarIcon,
  UserIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../../context/AuthContext';
import { USER_ROLES } from '../../utils/constants';

const MobileNav = () => {
  const location = useLocation();
  const { user } = useAuth();

  const navigation = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: HomeIcon,
      roles: [USER_ROLES.ADMIN, USER_ROLES.DEVELOPER, USER_ROLES.TESTER, USER_ROLES.REPORTER]
    },
    {
      name: 'Bugs',
      href: '/bugs',
      icon: BugAntIcon,
      roles: [USER_ROLES.ADMIN, USER_ROLES.DEVELOPER, USER_ROLES.TESTER, USER_ROLES.REPORTER]
    },
    {
      name: 'Users',
      href: '/users',
      icon: UsersIcon,
      roles: [USER_ROLES.ADMIN]
    },
    {
      name: 'Analytics',
      href: '/analytics',
      icon: ChartBarIcon,
      roles: [USER_ROLES.ADMIN, USER_ROLES.TESTER]
    },
    {
      name: 'Profile',
      href: '/profile',
      icon: UserIcon,
      roles: [USER_ROLES.ADMIN, USER_ROLES.DEVELOPER, USER_ROLES.TESTER, USER_ROLES.REPORTER]
    }
  ];

  const filteredNavigation = navigation.filter(item => 
    item.roles.includes(user?.role)
  );

  const isCurrentPath = (href) => {
    return location.pathname === href || 
           (href !== '/dashboard' && location.pathname.startsWith(href));
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 md:hidden z-50">
      <div className="grid grid-cols-5 py-1">
        {filteredNavigation.slice(0, 5).map((item) => {
          const Icon = item.icon;
          const isCurrent = isCurrentPath(item.href);
          
          return (
            <Link
              key={item.name}
              to={item.href}
              className={clsx(
                'flex flex-col items-center py-2 px-1 text-xs transition-colors',
                isCurrent
                  ? 'text-blue-600 dark:text-blue-400'
                  : 'text-gray-500 dark:text-gray-400'
              )}
            >
              <Icon className="h-6 w-6 mb-1" />
              <span className="truncate w-full text-center">
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileNav;
