import { formatRelativeTime, formatDate } from '../utils/format';

/**
 * RelativeTime Component
 * Displays relative time (e.g., "2 hours ago") with exact timestamp on hover
 */
const RelativeTime = ({ dateString, className = '' }) => {
  const relative = formatRelativeTime(dateString);
  const exact = formatDate(dateString, 'PPp'); // e.g., "January 15, 2024 at 3:45 PM"

  return (
    <span 
      className={className} 
      title={exact}
      style={{ cursor: 'help' }}
    >
      {relative}
    </span>
  );
};

export default RelativeTime;

