import { Link } from 'react-router-dom';
import { formatNumber } from '../utils/format';
import VoteButtons from './VoteButtons';
import RelativeTime from './RelativeTime';

/**
 * ThreadCard Component
 * Modern, compact thread preview card
 */
const ThreadCard = ({ thread, onVote }) => {
  const score = thread.upvotes - thread.downvotes;

  return (
    <div className="card card-hover mb-2 flex overflow-hidden">
      <div className="bg-bg-tertiary p-2 flex flex-col items-center min-w-[3rem]">
        <VoteButtons
          score={score}
          userVote={thread.userVote}
          onUpvote={() => onVote?.(thread.id, true)}
          onDownvote={() => onVote?.(thread.id, false)}
        />
      </div>
      <div className="flex-1 p-3">
        <div className="flex items-center gap-2 text-xs text-text-secondary mb-1 flex-wrap">
          <Link
            to={`/b/${thread.box?.slug}`}
            className="text-text-primary font-semibold hover:text-accent-primary transition-colors"
          >
            b/{thread.box?.slug}
          </Link>
          <span>•</span>
          <Link to={`/u/${thread.userId}`} className="text-text-secondary hover:text-accent-primary hover:underline transition-colors">u/{thread.userId}</Link>
          <span>•</span>
          <RelativeTime dateString={thread.createdAt} />
        </div>
        <Link to={`/box/${thread.box?.slug}/thread/${thread.id}`} className="block text-text-primary no-underline">
          <h3 className="my-2 text-text-primary text-lg font-semibold leading-tight hover:text-accent-primary transition-colors">
            {thread.title}
          </h3>
          {thread.description && (
            <p className="my-2 text-text-secondary text-sm leading-snug line-clamp-2">
              {thread.description}
            </p>
          )}
          {thread.type === 'LINK' && thread.content && (
            <a
              href={thread.content}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-accent-secondary text-sm mt-2 break-all hover:underline"
              onClick={(e) => e.stopPropagation()}
            >
              {thread.content}
            </a>
          )}
          {thread.type === 'IMAGE' && thread.content && (
            <img
              src={thread.content}
              alt={thread.title}
              className="max-w-full max-h-96 mt-2 rounded-md"
            />
          )}
        </Link>
        <div className="flex justify-between items-center mt-3 pt-3 border-t border-border text-sm">
          <Link
            to={`/box/${thread.box?.slug}/thread/${thread.id}`}
            className="text-text-secondary hover:text-text-primary hover:underline transition-colors"
          >
            {formatNumber(thread.commentCount || 0)} comments
          </Link>
          <span className="text-text-secondary uppercase text-xs">{thread.type}</span>
        </div>
      </div>
    </div>
  );
};

export default ThreadCard;
