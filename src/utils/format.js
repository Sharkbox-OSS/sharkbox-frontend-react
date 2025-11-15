import { formatDistanceToNow, format } from 'date-fns';

/**
 * Format utilities
 * Common formatting functions for dates, numbers, etc.
 */

/**
 * Format a date as relative time (e.g., "2 hours ago")
 */
export const formatRelativeTime = (dateString) => {
  if (!dateString) {
    return 'unknown time';
  }
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return 'unknown time';
    }
    return formatDistanceToNow(date, { addSuffix: true });
  } catch {
    return 'unknown time';
  }
};

/**
 * Format a date in a specific format
 */
export const formatDate = (dateString, formatString = 'PPp') => {
  if (!dateString) {
    return 'unknown date';
  }
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return 'unknown date';
    }
    return format(date, formatString);
  } catch {
    return 'unknown date';
  }
};

/**
 * Format a number with K/M suffix for large numbers
 */
export const formatNumber = (num) => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
};

