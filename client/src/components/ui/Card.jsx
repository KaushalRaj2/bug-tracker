import React from 'react';
import { clsx } from 'clsx';

const Card = ({ 
  children, 
  className, 
  padding = 'default',
  shadow = 'default',
  border = true,
  ...props 
}) => {
  const paddings = {
    none: '',
    sm: 'p-4',
    default: 'p-6',
    lg: 'p-8'
  };

  const shadows = {
    none: '',
    sm: 'shadow-sm',
    default: 'shadow',
    lg: 'shadow-lg'
  };

  return (
    <div
      className={clsx(
        'bg-white rounded-lg',
        paddings[padding],
        shadows[shadow],
        border && 'border border-gray-200',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

const CardHeader = ({ children, className }) => (
  <div className={clsx('pb-4 border-b border-gray-200', className)}>
    {children}
  </div>
);

const CardTitle = ({ children, className }) => (
  <h3 className={clsx('text-lg font-semibold text-gray-900', className)}>
    {children}
  </h3>
);

const CardContent = ({ children, className }) => (
  <div className={clsx('pt-4', className)}>
    {children}
  </div>
);

const CardFooter = ({ children, className }) => (
  <div className={clsx('pt-4 border-t border-gray-200', className)}>
    {children}
  </div>
);

Card.Header = CardHeader;
Card.Title = CardTitle;
Card.Content = CardContent;
Card.Footer = CardFooter;

export default Card;
