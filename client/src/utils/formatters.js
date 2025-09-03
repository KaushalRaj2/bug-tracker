import { formatDate, formatRelativeTime } from './helpers';

// Currency formatting
export const formatCurrency = (amount, currency = 'USD', locale = 'en-US') => {
  if (amount == null || isNaN(amount)) return '$0.00';
  
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2
    }).format(amount);
  } catch (error) {
    return `$${Number(amount).toFixed(2)}`;
  }
};

// Number formatting
export const formatNumber = (num, locale = 'en-US') => {
  if (num == null || isNaN(num)) return '0';
  
  try {
    return new Intl.NumberFormat(locale).format(num);
  } catch (error) {
    return String(num);
  }
};

// Percentage formatting
export const formatPercentage = (value, decimals = 1) => {
  if (value == null || isNaN(value)) return '0%';
  return `${Number(value).toFixed(decimals)}%`;
};

// File size formatting
export const formatFileSize = (bytes) => {
  if (bytes == null || isNaN(bytes) || bytes === 0) return '0 B';
  
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

// Duration formatting (in minutes)
export const formatDuration = (minutes) => {
  if (minutes == null || isNaN(minutes) || minutes < 0) return '0 min';
  
  const hours = Math.floor(minutes / 60);
  const mins = Math.floor(minutes % 60);
  const days = Math.floor(hours / 24);
  const remainingHours = hours % 24;
  
  if (days > 0) {
    return `${days}d ${remainingHours}h ${mins}m`;
  } else if (hours > 0) {
    return `${hours}h ${mins}m`;
  } else {
    return `${mins} min`;
  }
};

// Bug status formatting
export const formatBugStatus = (status) => {
  if (!status) return 'Unknown';
  
  const statusMap = {
    'open': 'Open',
    'in-progress': 'In Progress',
    'testing': 'Testing',
    'closed': 'Closed',
    'reopened': 'Reopened'
  };
  
  return statusMap[status] || status.charAt(0).toUpperCase() + status.slice(1);
};

// Priority formatting with icons
export const formatPriority = (priority, includeIcon = false) => {
  if (!priority) return includeIcon ? '⚪ Unknown' : 'Unknown';
  
  const priorityMap = {
    'low': { text: 'Low', icon: '🟢' },
    'medium': { text: 'Medium', icon: '🟡' },
    'high': { text: 'High', icon: '🟠' },
    'critical': { text: 'Critical', icon: '🔴' }
  };
  
  const formatted = priorityMap[priority] || { text: priority, icon: '⚪' };
  return includeIcon ? `${formatted.icon} ${formatted.text}` : formatted.text;
};

// User role formatting
export const formatUserRole = (role) => {
  if (!role) return 'User';
  
  const roleMap = {
    'admin': 'Administrator',
    'developer': 'Developer',
    'tester': 'QA Tester',
    'reporter': 'Bug Reporter'
  };
  
  return roleMap[role] || role.charAt(0).toUpperCase() + role.slice(1);
};

// Date and time formatters
export const formatDateTime = (date, includeTime = false) => {
  if (!date) return 'N/A';
  
  try {
    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) return 'Invalid Date';
    
    if (includeTime) {
      return dateObj.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } else {
      return formatDate(date);
    }
  } catch (error) {
    return 'Invalid Date';
  }
};

// Time ago formatting
export const formatTimeAgo = (date) => {
  return formatRelativeTime(date);
};

// Bug ID formatting (for display)
export const formatBugId = (id) => {
  if (!id) return 'N/A';
  // Show first 8 characters of MongoDB ObjectId
  return `#${String(id).slice(-8).toUpperCase()}`;
};

// Text truncation with ellipsis
export const formatText = (text, maxLength = 100, addEllipsis = true) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  
  const truncated = text.slice(0, maxLength);
  return addEllipsis ? `${truncated}...` : truncated;
};

// Phone number formatting
export const formatPhoneNumber = (phone) => {
  if (!phone) return 'N/A';
  
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, '');
  
  // Format as (XXX) XXX-XXXX if 10 digits
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }
  
  return phone; // Return original if can't format
};

// Email formatting (basic validation)
export const formatEmail = (email) => {
  if (!email) return 'N/A';
  return email.toLowerCase().trim();
};

// Tags formatting for display
export const formatTags = (tags) => {
  if (!tags || !Array.isArray(tags)) return [];
  return tags.filter(tag => tag && tag.trim()).map(tag => tag.trim());
};

// Comment count formatting
export const formatCommentCount = (count) => {
  if (!count || count === 0) return 'No comments';
  if (count === 1) return '1 comment';
  return `${formatNumber(count)} comments`;
};

// Attachment count formatting
export const formatAttachmentCount = (count) => {
  if (!count || count === 0) return 'No attachments';
  if (count === 1) return '1 attachment';
  return `${formatNumber(count)} attachments`;
};

// Progress percentage formatting
export const formatProgress = (completed, total) => {
  if (!total || total === 0) return '0%';
  const percentage = (completed / total) * 100;
  return `${Math.round(percentage)}%`;
};

// Validation error formatting
export const formatValidationError = (error) => {
  if (!error) return '';
  if (typeof error === 'string') return error;
  if (error.message) return error.message;
  return 'Validation error occurred';
};

// API error formatting
export const formatApiError = (error) => {
  if (!error) return 'Unknown error occurred';
  
  if (typeof error === 'string') return error;
  if (error.message) return error.message;
  if (error.error) return error.error;
  if (error.details) return error.details;
  
  return 'An error occurred while processing your request';
};

// Search result highlighting
export const formatSearchHighlight = (text, searchTerm) => {
  if (!text || !searchTerm) return text;
  
  const regex = new RegExp(`(${searchTerm})`, 'gi');
  return text.replace(regex, '<mark>$1</mark>');
};

// Default export object with all formatters
const formatters = {
  // Currency & Numbers
  formatCurrency,
  formatNumber,
  formatPercentage,
  formatFileSize,
  formatDuration,
  
  // Bug-specific
  formatBugStatus,
  formatPriority,
  formatBugId,
  formatCommentCount,
  formatAttachmentCount,
  formatProgress,
  
  // User-related
  formatUserRole,
  formatPhoneNumber,
  formatEmail,
  
  // Date & Time
  formatDateTime,
  formatTimeAgo,
  
  // Text & Content
  formatText,
  formatTags,
  formatSearchHighlight,
  
  // Error handling
  formatValidationError,
  formatApiError
};

export default formatters;
