import { cn } from '../utils/tailwindUtils';

/**
 * VoteButtons Component
 * Compact, modern upvote/downvote buttons
 */
const VoteButtons = ({ score, userVote, onUpvote, onDownvote, layout = 'stack' }) => {
  if (layout === 'inline') {
    return (
      <div className="flex items-center gap-2 text-xs">
        <button
          className={cn(
            "bg-transparent border-none cursor-pointer text-base text-text-secondary p-0.5 leading-none",
            "hover:text-accent-primary",
            userVote === true && "text-accent-primary"
          )}
          onClick={onUpvote}
          aria-label="Upvote"
        >
          ▲
        </button>
        <span
          className={cn(
            "font-semibold text-xs text-text-secondary",
            userVote === true && "text-accent-primary",
            userVote === false && "text-accent-secondary"
          )}
        >
          {score}
        </span>
        <button
          className={cn(
            "bg-transparent border-none cursor-pointer text-base text-text-secondary p-0.5 leading-none",
            "hover:text-accent-secondary",
            userVote === false && "text-accent-secondary"
          )}
          onClick={onDownvote}
          aria-label="Downvote"
        >
          ▼
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-0.5 min-w-[2rem]">
      <button
        className={cn(
          "bg-transparent border-none cursor-pointer text-lg text-text-secondary p-1 transition-colors leading-none",
          "hover:text-text-primary hover:text-accent-primary",
          userVote === true && "text-accent-primary"
        )}
        onClick={onUpvote}
        aria-label="Upvote"
      >
        ▲
      </button>
      <span 
        className={cn(
          "font-semibold text-xs text-text-primary min-w-[1.5rem] text-center",
          userVote === true && "text-accent-primary",
          userVote === false && "text-accent-secondary"
        )}
      >
        {score}
      </span>
      <button
        className={cn(
          "bg-transparent border-none cursor-pointer text-lg text-text-secondary p-1 transition-colors leading-none",
          "hover:text-text-primary hover:text-accent-secondary",
          userVote === false && "text-accent-secondary"
        )}
        onClick={onDownvote}
        aria-label="Downvote"
      >
        ▼
      </button>
    </div>
  );
};

export default VoteButtons;
