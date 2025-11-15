import { Link } from 'react-router-dom';
import RelativeTime from './RelativeTime';

/**
 * BoxCard Component
 * Modern, compact box preview card
 */
const BoxCard = ({ box }) => {
  return (
    <Link 
      to={`/b/${box.slug}`} 
      className="block card card-hover mb-4 p-4 no-underline hover:no-underline text-inherit"
    >
      <div className="flex justify-between items-center mb-2">
        <h3 className="m-0 text-accent-primary text-base font-semibold">b/{box.slug}</h3>
        <span className="text-xs text-text-secondary uppercase px-2 py-1 bg-bg-tertiary rounded">
          {box.access}
        </span>
      </div>
      <h4 className="my-2 text-text-primary text-lg font-semibold">{box.name}</h4>
      {box.description && (
        <p className="my-2 text-text-secondary text-sm leading-relaxed line-clamp-2">
          {box.description}
        </p>
      )}
      <div className="flex justify-between mt-3 pt-3 border-t border-border text-sm">
        <span className="text-text-secondary">by {box.owner}</span>
        <RelativeTime dateString={box.createdAt} className="text-text-secondary" />
      </div>
    </Link>
  );
};

export default BoxCard;
