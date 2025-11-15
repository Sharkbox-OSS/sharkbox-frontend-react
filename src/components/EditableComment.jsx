import { useState } from 'react';
import VoteButtons from './VoteButtons';
import RelativeTime from './RelativeTime';
import { useAuth } from '../hooks/useAuth';
import { cn } from '../utils/tailwindUtils';

/**
 * EditableComment Component
 * Modern comment with proper visual separation and nesting
 */
const EditableComment = ({ comment, onVote, onEdit, onReply, onToggleCollapse, isCollapsed = false, level = 0, isOp = false }) => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);

  const score = comment.upvotes - comment.downvotes;
  const canEdit = user?.profile?.sub === comment.userId;

  // A comment is considered edited only if updatedAt is present and
  // strictly later than createdAt by a small threshold (to ignore
  // backend rounding/serialization differences).
  const isEdited = (() => {
    if (!comment?.updatedAt) return false;
    if (!comment?.createdAt) return false;
    const created = new Date(comment.createdAt).getTime();
    const updated = new Date(comment.updatedAt).getTime();
    if (Number.isNaN(created) || Number.isNaN(updated)) return false;
    return updated - created > 5000; // >5s difference counts as edited
  })();

  const handleSave = async () => {
    if (!editContent.trim()) return;
    setIsSubmitting(true);
    try {
      await onEdit(comment, editContent);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to edit comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setEditContent(comment.content);
    setIsEditing(false);
  };

  const handleReplySubmit = async (e) => {
    e.preventDefault();
    if (!replyContent.trim()) return;
    setIsSubmitting(true);
    try {
      await onReply?.(comment, replyContent);
      setReplyContent('');
      setIsReplying(false);
    } catch (error) {
      console.error('Failed to reply to comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyLink = async () => {
    const hash = `comment-${comment.id}`;
    const url = `${window.location.origin}${window.location.pathname}#${hash}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 1500);
    } catch {
      // ignore
    }
  };

  return (
    <div id={`comment-${comment.id}`} className={cn("flex gap-3 mb-2")}> 
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 text-xs text-text-secondary mb-1 flex-wrap">
          {/* Collapse/expand toggle */}
          <button
            className="w-5 h-5 rounded-full bg-transparent border border-border text-text-secondary flex items-center justify-center leading-none cursor-pointer hover:text-accent-primary"
            onClick={() => onToggleCollapse?.(comment.id)}
            aria-label={isCollapsed ? 'Expand' : 'Collapse'}
          >
            {isCollapsed ? '+' : '–'}
          </button>
          <span className="text-accent-primary font-semibold hover:underline cursor-pointer">u/{comment.userId}</span>
          {isOp && (
            <span className="px-1.5 py-0.5 rounded bg-accent-primary/20 text-accent-primary text-xs font-semibold">OP</span>
          )}
          <span className="text-text-secondary">•</span>
          <RelativeTime dateString={comment.createdAt} className="text-text-secondary" />
          {isEdited && (
            <>
              <span className="text-text-secondary">•</span>
              <span className="text-xs italic text-text-secondary">edited</span>
            </>
          )}
          {canEdit && !isEditing && (
            <>
              <span className="text-text-secondary">•</span>
              <button
                className="text-text-secondary hover:text-accent-primary text-xs font-medium cursor-pointer bg-transparent border-none p-0 transition-colors"
                onClick={() => setIsEditing(true)}
              >
                Edit
              </button>
            </>
          )}
        </div>
        {!isCollapsed && (isEditing ? (
          <div className="space-y-3">
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="input-base text-sm min-h-[100px] resize-y"
              rows="4"
            />
            <div className="flex gap-2 justify-end">
              <button
                onClick={handleCancel}
                className="btn-secondary text-sm py-1.5 px-3"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="btn-primary text-sm py-1.5 px-3"
                disabled={isSubmitting || !editContent.trim()}
              >
                {isSubmitting ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        ) : (
          <div className="text-text-primary leading-relaxed mb-2 text-sm">
            <p className="m-0 break-words">{comment.content}</p>
          </div>
        ))}

        {/* Footer: inline voting + actions, hidden when collapsed */}
        {!isCollapsed && (
          <div className="flex items-center gap-4 mt-1 text-xs">
            <VoteButtons
              score={score}
              userVote={comment.userVote}
              onUpvote={() => onVote?.(comment, true)}
              onDownvote={() => onVote?.(comment, false)}
              layout="inline"
            />

            <button
              className="text-text-secondary hover:text-accent-primary font-medium cursor-pointer bg-transparent border-none p-0 transition-colors"
              onClick={() => setIsReplying((v) => !v)}
            >
              {isReplying ? 'Cancel' : 'Reply'}
            </button>
            <button
              className="text-text-secondary hover:text-accent-primary font-medium cursor-pointer bg-transparent border-none p-0 transition-colors"
              onClick={handleCopyLink}
              aria-label="Copy comment link"
              title="Copy link"
            >
              {copiedLink ? 'Copied' : 'Link'}
            </button>
          </div>
        )}

        {!isCollapsed && isReplying && (
          <form onSubmit={handleReplySubmit} className="mt-2 space-y-2">
            <textarea
              className="input-base text-sm min-h-[80px] resize-y"
              rows="3"
              placeholder="Write a reply..."
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              required
            />
            <div className="flex gap-2 justify-end">
              <button
                type="button"
                className="btn-secondary text-sm py-1.5 px-3"
                onClick={() => {
                  setIsReplying(false);
                  setReplyContent('');
                }}
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary text-sm py-1.5 px-3"
                disabled={isSubmitting || !replyContent.trim()}
              >
                {isSubmitting ? 'Replying...' : 'Reply'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default EditableComment;
