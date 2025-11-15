import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useInfinitePagination } from '../hooks/useInfinitePagination';
import { getBoxBySlug } from '../services/boxService';
import { getThreads, voteOnThread } from '../services/threadService';
import { useAuth } from '../hooks/useAuth';
import ThreadCard from '../components/ThreadCard';
import { ThreadCardSkeleton } from '../components/LoadingSkeleton';

/**
 * BoxPage Component
 * Modern, responsive page displaying threads in a specific box
 */
const BoxPage = () => {
  const { slug } = useParams();
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();

  const { data: box, isLoading: boxLoading } = useQuery({
    queryKey: ['box', slug],
    queryFn: () => getBoxBySlug(slug),
    enabled: !!slug,
  });

  const {
    items: threadsData,
    isLoading: threadsLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    sentinelRef,
  } = useInfinitePagination({
    queryKey: ['threads', slug],
    sort: ['createdAt,desc','id,desc'],
    enabled: !!slug,
    fetchPage: (page, size, sort) => getThreads(slug, page, size, sort),
  });

  const voteMutation = useMutation({
    mutationFn: ({ threadId, isUpvote }) => voteOnThread(threadId, isUpvote),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['threads', slug] });
      queryClient.invalidateQueries({ queryKey: ['thread', slug] });
    },
  });

  const handleVote = (threadId, isUpvote) => {
    if (!isAuthenticated) {
      alert('Please login to vote');
      return;
    }
    voteMutation.mutate({ threadId, isUpvote });
  };


  if (boxLoading) {
    return (
      <div className="container-content">
        <div className="text-center py-8">Loading...</div>
      </div>
    );
  }

  return (
    <div className="container-content">
      {box && (
        <div className="card mb-8 p-6 flex flex-col sm:flex-row justify-between gap-4">
          <div className="flex-1">
            <h1 className="text-accent-primary m-0 mb-2 text-2xl font-bold">b/{box.slug}</h1>
            <h2 className="text-text-primary m-0 mb-2 text-xl font-semibold">{box.name}</h2>
            {box.description && (
              <p className="text-text-secondary m-2 mt-0 leading-relaxed">{box.description}</p>
            )}
          </div>
          {isAuthenticated && (
            <Link to={`/b/${slug}/submit`} className="btn-primary whitespace-nowrap self-start">
              Create Thread
            </Link>
          )}
        </div>
      )}

      {threadsLoading && threadsData.length === 0 ? (
        <div className="flex flex-col gap-2">
          {[...Array(5)].map((_, i) => (
            <ThreadCardSkeleton key={i} />
          ))}
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-2">
            {threadsData.map((thread, index) => {
              return <ThreadCard key={thread.id} thread={thread} onVote={handleVote} />;
            })}
          </div>
          {isFetchingNextPage && (
            <div className="flex flex-col gap-2 mt-2">
              <ThreadCardSkeleton />
            </div>
          )}
          <div ref={sentinelRef} className="h-4" />
          {threadsData.length === 0 && (
            <div className="text-center py-12 text-text-secondary text-lg">
              No threads yet. Be the first to post!
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default BoxPage;
