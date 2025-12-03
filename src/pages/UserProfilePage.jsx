import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useInfinitePagination } from '../hooks/useInfinitePagination';
import { getThreadsByUser, voteOnThread } from '../services/threadService';
import { getCommentsByUser, voteOnComment } from '../services/commentService';
import ThreadCard from '../components/ThreadCard';
import Comment from '../components/Comment';
import { CommentSkeleton, ThreadCardSkeleton } from '../components/LoadingSkeleton';
import { useAuth } from '../hooks/useAuth';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const UserProfilePage = () => {
    const { username } = useParams();
    const [activeTab, setActiveTab] = useState('threads');
    const { isAuthenticated } = useAuth();
    const queryClient = useQueryClient();

    const {
        items: threads,
        isLoading: threadsLoading,
        hasNextPage: threadsHasNextPage,
        isFetchingNextPage: threadsIsFetchingNextPage,
        fetchNextPage: threadsFetchNextPage,
        sentinelRef: threadsLoadMoreRef,
    } = useInfinitePagination({
        queryKey: ['user-threads', username],
        sort: ['createdAt,desc'],
        enabled: activeTab === 'threads',
        fetchPage: (page, size, sort) => getThreadsByUser(username, page, size, sort),
    });

    const {
        items: comments,
        isLoading: commentsLoading,
        hasNextPage: commentsHasNextPage,
        isFetchingNextPage: commentsIsFetchingNextPage,
        fetchNextPage: commentsFetchNextPage,
        sentinelRef: commentsLoadMoreRef,
    } = useInfinitePagination({
        queryKey: ['user-comments', username],
        sort: ['createdAt,desc'],
        enabled: activeTab === 'comments',
        fetchPage: (page, size, sort) => getCommentsByUser(username, page, size, sort),
    });

    const voteThreadMutation = useMutation({
        mutationFn: ({ threadId, isUpvote }) => voteOnThread(threadId, isUpvote),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['user-threads', username] });
        },
    });

    const voteCommentMutation = useMutation({
        mutationFn: ({ threadId, commentId, isUpvote }) => voteOnComment(threadId, commentId, isUpvote),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['user-comments', username] });
        },
    });

    const handleThreadVote = (threadId, isUpvote) => {
        if (!isAuthenticated) return alert('Please login to vote');
        voteThreadMutation.mutate({ threadId, isUpvote });
    };

    const handleCommentVote = (comment, isUpvote) => {
        if (!isAuthenticated) return alert('Please login to vote');
        voteCommentMutation.mutate({ threadId: comment.threadId, commentId: comment.id, isUpvote });
    };

    return (
        <div className="container-narrow py-8">
            <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-16 rounded-full bg-accent-primary/20 flex items-center justify-center text-2xl font-bold text-accent-primary">
                    {username.charAt(0).toUpperCase()}
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-text-primary">u/{username}</h1>
                </div>
            </div>

            <div className="flex border-b border-border mb-6">
                <button
                    className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${activeTab === 'threads'
                        ? 'border-accent-primary text-accent-primary'
                        : 'border-transparent text-text-secondary hover:text-text-primary'
                        }`}
                    onClick={() => setActiveTab('threads')}
                >
                    Threads
                </button>
                <button
                    className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${activeTab === 'comments'
                        ? 'border-accent-primary text-accent-primary'
                        : 'border-transparent text-text-secondary hover:text-text-primary'
                        }`}
                    onClick={() => setActiveTab('comments')}
                >
                    Comments
                </button>
            </div>

            {activeTab === 'threads' && (
                <div className="space-y-4">
                    {threadsLoading ? (
                        [...Array(3)].map((_, i) => <ThreadCardSkeleton key={i} />)
                    ) : threads?.length > 0 ? (
                        <>
                            {threads.map((thread) => (
                                <ThreadCard key={thread.id} thread={thread} onVote={handleThreadVote} />
                            ))}
                            <div ref={threadsLoadMoreRef} className="py-4 text-center text-text-secondary min-h-[1px]">
                                {threadsIsFetchingNextPage ? 'Loading more...' : ''}
                            </div>
                        </>
                    ) : (
                        <div className="text-center py-8 text-text-secondary">No threads found</div>
                    )}
                </div>
            )}

            {activeTab === 'comments' && (
                <div className="space-y-4">
                    {commentsLoading ? (
                        [...Array(3)].map((_, i) => <CommentSkeleton key={i} />)
                    ) : comments?.length > 0 ? (
                        <>
                            {comments.map((comment) => (
                                <div key={comment.id} className="card p-4">
                                    <div className="text-xs text-text-secondary mb-2">
                                        Commented on <Link to={`/box/${comment.threadBoxSlug}/thread/${comment.threadId}`} className="text-accent-primary hover:underline">{comment.threadTitle}</Link>
                                    </div>
                                    <Comment comment={comment} onVote={handleCommentVote} />
                                </div>
                            ))}
                            <div ref={commentsLoadMoreRef} className="py-4 text-center text-text-secondary min-h-[1px]">
                                {commentsIsFetchingNextPage ? 'Loading more...' : ''}
                            </div>
                        </>
                    ) : (
                        <div className="text-center py-8 text-text-secondary">No comments found</div>
                    )}
                </div>
            )}
        </div>
    );
};

export default UserProfilePage;
