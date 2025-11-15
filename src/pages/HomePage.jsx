import { useInfinitePagination } from '../hooks/useInfinitePagination';
import { getBoxes } from '../services/boxService';
import BoxCard from '../components/BoxCard';
import { BoxCardSkeleton } from '../components/LoadingSkeleton';

/**
 * HomePage Component
 * Modern, responsive homepage displaying all boxes
 */
const HomePage = () => {
  const { items: boxes, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage, sentinelRef } = useInfinitePagination({
    queryKey: ['boxes'],
    sort: ['name,asc','id,asc'],
    fetchPage: (page, size, sort) => getBoxes(page, size, sort),
    enabled: true,
  });

  if (isLoading) {
    return (
      <div className="container-content">
        <h1 className="text-text-primary mb-8 text-2xl font-bold">All Boxes</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <BoxCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container-content">
      <h1 className="text-text-primary mb-8 text-2xl font-bold">All Boxes</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {boxes?.map((box) => (
          <BoxCard key={box.id} box={box} />
        ))}
      </div>
      <div ref={sentinelRef} className="h-4" />
      {isFetchingNextPage && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
          <BoxCardSkeleton />
        </div>
      )}
      {(!boxes || boxes.length === 0) && (
        <div className="text-center py-12 text-text-secondary text-lg">
          No boxes found. Create one to get started!
        </div>
      )}
    </div>
  );
};

export default HomePage;
