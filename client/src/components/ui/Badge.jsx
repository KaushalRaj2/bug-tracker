import React from 'react';
import clsx from 'clsx';

const Badge = ({ 
  children, 
  variant = 'default', 
  size = 'default',
  className = '',
  dot = false 
}) => {
  const variantClasses = {
    default: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
    primary: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    success: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    warning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    danger: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    info: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-300'
  };

  const sizeClasses = {
    xs: 'px-1.5 py-0.5 text-xs min-w-[1rem] h-4',
    sm: 'px-2 py-0.5 text-xs min-w-[1.25rem] h-5', 
    default: 'px-2.5 py-0.5 text-sm min-w-[1.5rem] h-6',
    lg: 'px-3 py-1 text-base min-w-[2rem] h-8'
  };

  const baseClasses = clsx(
    'inline-flex items-center justify-center rounded-full font-medium whitespace-nowrap',
    'border border-transparent',
    // Ensure perfect circle for dot badges or single characters
    dot || (typeof children === 'string' && children.length <= 2) 
      ? 'aspect-square' 
      : 'min-w-fit',
    variantClasses[variant],
    sizeClasses[size],
    className
  );

  if (dot) {
    return (
      <span className={clsx(
        'inline-block rounded-full',
        size === 'xs' ? 'w-2 h-2' : 
        size === 'sm' ? 'w-2.5 h-2.5' :
        size === 'lg' ? 'w-4 h-4' : 'w-3 h-3',
        variantClasses[variant]
      )} />
    );
  }

  return (
    <span className={baseClasses}>
      {children}
    </span>
  );
};

export default Badge;
