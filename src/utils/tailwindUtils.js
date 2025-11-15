/**
 * Tailwind Utility Functions
 * DRY helper functions for common class combinations
 */

/**
 * Get responsive classes for container
 */
export const containerClasses = {
  wide: 'max-w-7xl mx-auto px-4',
  narrow: 'max-w-4xl mx-auto px-4',
  full: 'w-full px-4',
};

/**
 * Get spacing classes for comments (nesting)
 */
export const getNestedClasses = (level) => {
  if (level === 0) return '';
  return `ml-6`;
};

/**
 * Get text size classes based on importance
 */
export const textSizeClasses = {
  xs: 'text-xs',
  sm: 'text-sm',
  base: 'text-base',
  lg: 'text-lg',
  xl: 'text-xl',
  '2xl': 'text-2xl',
};

/**
 * Get gap classes for flex/grid
 */
export const gapClasses = {
  none: 'gap-0',
  xs: 'gap-1',
  sm: 'gap-2',
  md: 'gap-4',
  lg: 'gap-6',
};

/**
 * Combine multiple class strings, filtering out falsy values
 */
export const cn = (...classes) => {
  return classes.filter(Boolean).join(' ');
};

