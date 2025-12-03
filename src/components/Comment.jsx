import { Link } from 'react-router-dom';
import { formatRelativeTime } from '../utils/format';
import VoteButtons from './VoteButtons';
import { cn } from '../utils/tailwindUtils';

/**
 * Comment Component
 * Compact, modern comment display with voting
 */
const Comment = ({ comment, onVote, level = 0 }) => {
  const score = comment.upvotes - comment.downvotes;
  const isNested = level > 0;

  return (
    <div className={cn(
      "flex gap-2 py-1 mb-1",
      isNested && "ml-6"
    )}>
      <div className="flex flex-col items-center min-w-[2rem] pt-1">
        <VoteButtons
          score={score}
          userVote={comment.userVote}
          onUpvote={() => onVote?.(comment, true)}
          onDownvote={() => onVote?.(comment, false)}
        />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 text-xs text-text-secondary mb-1">
          <Link to={`/u/${comment.userId}`} className="text-text-primary font-semibold hover:underline no-underline">u/{comment.userId}</Link>
          <span>•</span>
          <span>{formatRelativeTime(comment.createdAt)}</span>
        </div>
        <div className="text-text-primary leading-relaxed mb-1 text-sm">
          <p className="m-0 break-words">{comment.content}</p>
        </div>
      </div>
    </div>
  );
};

export default Comment;
