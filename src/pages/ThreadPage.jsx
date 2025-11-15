import { useParams, Link, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useInfinitePagination } from '../hooks/useInfinitePagination';
import { getThread, voteOnThread } from '../services/threadService';
import { getComments, createComment, voteOnComment, updateComment } from '../services/commentService';
import { useAuth } from '../hooks/useAuth';
import { formatNumber } from '../utils/format';
import VoteButtons from '../components/VoteButtons';
import EditableComment from '../components/EditableComment';
import { CommentSkeleton } from '../components/LoadingSkeleton';
import RelativeTime from '../components/RelativeTime';

/**
 * Build comment tree structure and render with proper nesting
 */
const renderCommentsTree = (comments, onVote, onEdit, onReply, onToggleCollapse, collapsedIds, threadUserId, parentId = null, level = 0) => {
  // Find all comments with this parentId
  const directChildren = comments.filter(c => {
    if (parentId === null) return !c.parentId;
    return c.parentId === parentId;
  });

  // Sort by creation date (oldest first)
  directChildren.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

  return directChildren.map((comment) => {
    const isCollapsed = collapsedIds?.has(comment.id);
    const content = (
      <>
        <EditableComment
          comment={comment}
          onVote={onVote}
          onEdit={onEdit}
          onReply={onReply}
          onToggleCollapse={onToggleCollapse}
          isCollapsed={isCollapsed}
          level={level}
          isOp={threadUserId && comment.userId === threadUserId}
        />
        {/* Recursively render children */}
        {!isCollapsed && renderCommentsTree(comments, onVote, onEdit, onReply, onToggleCollapse, collapsedIds, threadUserId, comment.id, level + 1)}
      </>
    );

    // For nested levels, wrap the comment + its subtree in a container
    // that draws a continuous vertical rail (like Reddit) using border-left.
    if (level > 0) {
      const indentRem = 1.25; // apply a fixed step per nesting level to avoid compounding
      return (
        <div
          key={comment.id}
          className="border-l border-border pl-3"
          style={{ marginLeft: `${indentRem}rem` }}
        >
          {content}
        </div>
      );
    }

    return (
      <div key={comment.id}>
        {content}
      </div>
    );
  });
};

/**
 * ThreadPage Component
 * Modern, responsive page displaying a single thread with comments
 */
const ThreadPage = () => {
  const [collapsedIds, setCollapsedIds] = useState(new Set());
  const toggleCollapse = (id) => {
    setCollapsedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };
  const { id } = useParams();
  const { isAuthenticated, user, login } = useAuth();
  const location = useLocation();
  const queryClient = useQueryClient();

  const { data: thread, isLoading: threadLoading } = useQuery({
    queryKey: ['thread', id],
    queryFn: () => getThread(id),
    enabled: !!id,
  });

  // Comments: paginated (API page size 20). Use infinite query and auto-load while scrolling.
  const {
    items: flatComments,
    total: totalComments,
    isLoading: commentsLoading,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    sentinelRef: loadMoreRef,
  } = useInfinitePagination({
    queryKey: ['comments', id],
    sort: ['createdAt,asc','id,asc'],
    enabled: !!id,
    fetchPage: (page, size, sort) => getComments(id, page, size, sort),
  });

  // If a hash is present (e.g. #comment-123), scroll that comment into view
  useEffect(() => {
    let cancelled = false;
    const tryScroll = () => {
      if (!location.hash) return false;
      const id = location.hash.replace('#', '');
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        el.classList.add('comment-highlight', 'comment-highlight-animate');
        el.setAttribute('data-highlighted', 'true');
        setTimeout(() => el.classList.remove('comment-highlight-animate'), 1600);
        return true;
      }
      return false;
    };

    // If target not yet in DOM because it is on a later page, fetch until found or no more pages
    const ensureVisible = async () => {
      if (!location.hash) return;
      // Try immediately if comments exist
      if (flatComments && flatComments.length > 0 && tryScroll()) return;
      // Keep fetching pages while needed
      let safety = 10;
      while (!cancelled && hasNextPage && safety-- > 0) {
        await fetchNextPage();
        // give DOM a tick
        await new Promise(r => setTimeout(r, 0));
        if (tryScroll()) return;
      }
    };

    ensureVisible();
    return () => { cancelled = true; };
  }, [location.hash, flatComments, hasNextPage, fetchNextPage]);

  const voteThreadMutation = useMutation({
    mutationFn: ({ threadId, isUpvote }) => voteOnThread(threadId, isUpvote),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['thread', id] });
    },
  });

  const voteCommentMutation = useMutation({
    mutationFn: ({ threadId, commentId, isUpvote }) => voteOnComment(threadId, commentId, isUpvote),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', id] });
    },
  });

  const updateCommentMutation = useMutation({
    mutationFn: ({ threadId, commentId, content }) => updateComment(threadId, commentId, { content }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', id] });
    },
  });

  const createCommentMutation = useMutation({
    mutationFn: ({ threadId, content, parentId }) => createComment(threadId, { 
      threadId: parseInt(threadId), 
      content,
      ...(parentId && { parentId }),
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', id] });
    },
  });

  const handleThreadVote = (isUpvote) => {
    if (!isAuthenticated) {
      alert('Please login to vote');
      return;
    }
    voteThreadMutation.mutate({ threadId: id, isUpvote });
  };

  const handleCommentVote = (comment, isUpvote) => {
    if (!isAuthenticated) {
      alert('Please login to vote');
      return;
    }
    voteCommentMutation.mutate({ threadId: id, commentId: comment.id, isUpvote });
  };

  const handleEditComment = async (comment, newContent) => {
    return updateCommentMutation.mutateAsync({
      threadId: id,
      commentId: comment.id,
      content: newContent,
    });
  };

  const handleReplyComment = async (parentComment, replyContent) => {
    return createCommentMutation.mutateAsync({
      threadId: id,
      content: replyContent,
      parentId: parentComment.id,
    });
  };

  const handleSubmitComment = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const content = formData.get('content');

    if (!content.trim()) {
      return;
    }

    createCommentMutation.mutate(
      { threadId: id, content },
      {
        onSuccess: () => {
          e.target.reset();
        },
      }
    );
  };

  if (threadLoading) {
    return (
      <div className="container-narrow py-8">
        <div className="text-center py-8">Loading thread...</div>
      </div>
    );
  }

  if (!thread) {
    return (
      <div className="container-narrow py-8">
        <div className="text-center py-8 text-accent-primary">Thread not found</div>
      </div>
    );
  }

  const threadScore = thread.upvotes - thread.downvotes;

  return (
    <div className="container-narrow py-8">
      {/* Thread Detail */}
      <div className="card mb-6 flex overflow-hidden">
        <div className="bg-bg-tertiary p-4 flex flex-col items-center min-w-[3.5rem]">
          <VoteButtons
            score={threadScore}
            userVote={thread.userVote}
            onUpvote={() => handleThreadVote(true)}
            onDownvote={() => handleThreadVote(false)}
          />
        </div>
        <div className="flex-1 p-6">
          <div className="flex items-center gap-2 text-xs text-text-secondary mb-2 flex-wrap">
            <Link 
              to={`/b/${thread.box?.slug}`} 
              className="text-accent-primary font-semibold hover:underline transition-colors"
            >
              b/{thread.box?.slug}
            </Link>
            <span className="text-text-secondary">•</span>
            <span className="text-accent-primary hover:underline">u/{thread.userId}</span>
            <span className="text-text-secondary">•</span>
            <RelativeTime dateString={thread.createdAt} className="text-text-secondary" />
            {isAuthenticated && user?.profile?.sub === thread.userId && (
              <>
                <span className="text-text-secondary">•</span>
                <Link 
                  to={`/thread/${id}/edit`} 
                  className="text-accent-primary hover:underline transition-colors"
                >
                  Edit
                </Link>
              </>
            )}
          </div>
          <h1 className="m-0 mb-4 text-text-primary text-2xl font-bold">{thread.title}</h1>
          {thread.description && (
            <p className="m-0 mb-4 text-text-primary leading-relaxed">{thread.description}</p>
          )}
          {thread.type === 'LINK' && thread.content && (
            <a
              href={thread.content}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-accent-secondary break-all hover:underline mb-4"
            >
              {thread.content}
            </a>
          )}
          {thread.type === 'IMAGE' && thread.content && (
            <img 
              src={thread.content} 
              alt={thread.title} 
              className="max-w-full max-h-[600px] rounded-md mb-4"
            />
          )}
          {thread.type === 'TEXT' && thread.content && (
            <div className="text-text-primary leading-relaxed mb-4 whitespace-pre-wrap">
              {thread.content}
            </div>
          )}
        </div>
      </div>

      {/* Comment Form */}
      {isAuthenticated ? (
        <div className="card mb-4 p-4">
          <h3 className="m-0 mb-3 text-text-primary text-base font-semibold">Add a comment</h3>
          <form onSubmit={handleSubmitComment} className="flex flex-col gap-3">
            <textarea
              name="content"
              placeholder="What are your thoughts?"
              rows="3"
              required
              className="input-base min-h-[72px] resize-y"
            />
            <button 
              type="submit" 
              className="btn-primary self-end px-4 py-1.5 text-sm"
              disabled={createCommentMutation.isPending}
            >
              {createCommentMutation.isPending ? 'Posting...' : 'Comment'}
            </button>
          </form>
        </div>
      ) : (
        <div className="card mb-4 p-4">
          <h3 className="m-0 mb-3 text-text-primary text-base font-semibold">Add a comment</h3>
          <div className="flex items-end gap-3">
            <textarea
              name="content"
              placeholder="Log in to comment"
              rows="2"
              disabled
              className="input-base min-h-[56px] resize-none opacity-70"
            />
            <button 
              type="button" 
              className="btn-primary px-4 py-1.5 text-sm"
              onClick={() => login(window.location.href)}
            >
              Login
            </button>
          </div>
        </div>
      )}

      {/* Comments Section */}
      <div className="mt-6">
        <h2 className="text-text-primary mb-4 text-xl font-bold">
          {formatNumber(totalComments)} Comments
        </h2>
        {commentsLoading ? (
          <div className="flex flex-col gap-2">
            {[...Array(3)].map((_, i) => (
              <CommentSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-0">
            {renderCommentsTree(
              flatComments,
              handleCommentVote,
              handleEditComment,
              handleReplyComment,
              toggleCollapse,
              collapsedIds,
              thread?.userId
            )}
            <div ref={loadMoreRef} className="py-4 text-center text-text-secondary min-h-[1px]">
              {isFetchingNextPage ? 'Loading more…' : ''}
            </div>
            {hasNextPage && (
              <div className="text-center">
                <button
                  type="button"
                  className="btn-link"
                  disabled={isFetchingNextPage}
                  onClick={() => fetchNextPage()}
                >
                  {isFetchingNextPage ? 'Loading…' : 'Load more comments'}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ThreadPage;
