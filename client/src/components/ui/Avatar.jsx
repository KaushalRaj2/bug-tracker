import React from 'react';
import clsx from 'clsx';

const Avatar = ({ 
  src, 
  alt = '', 
  size = 'md', 
  className = '',
  fallback = '',
  onClick,
  children 
}) => {
  const sizeClasses = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg',
    xl: 'w-16 h-16 text-xl',
    '2xl': 'w-20 h-20 text-2xl'
  };

  const baseClasses = clsx(
    'relative inline-flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 font-medium flex-shrink-0 aspect-square overflow-hidden',
    sizeClasses[size],
    onClick && 'cursor-pointer hover:opacity-80 transition-opacity',
    className
  );

  // Generate initials from fallback text
  const getInitials = (text) => {
    if (!text) return '?';
    return text
      .split(' ')
      .slice(0, 2)
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase();
  };

  return (
    <div className={baseClasses} onClick={onClick}>
      {src ? (
        <img 
          src={src} 
          alt={alt} 
          className="w-full h-full object-cover rounded-full"
          onError={(e) => {
            e.target.style.display = 'none';
          }}
        />
      ) : (
        <span className="select-none font-semibold truncate px-1">
          {getInitials(fallback || alt)}
        </span>
      )}
      {children}
    </div>
  );
};

export default Avatar;
