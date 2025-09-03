import React from 'react';
import { clsx } from 'clsx';

const Select = ({
  label,
  children,
  value,
  onChange,
  error,
  disabled = false,
  required = false,
  placeholder = 'Select an option',
  className,
  ...props
}) => {
  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <select
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={clsx(
          'block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
          error 
            ? 'border-red-300 text-red-900 focus:ring-red-500 focus:border-red-500' 
            : 'border-gray-300 text-gray-900',
          disabled && 'bg-gray-50 cursor-not-allowed',
          className
        )}
        {...props}
      >
        <option value="" disabled>{placeholder}</option>
        {children}
      </select>
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export default Select;
