import { useInfinitePagination } from '../hooks/useInfinitePagination';
import { getBoxes } from '../services/boxService';
import BoxCard from '../components/BoxCard';
import { BoxCardSkeleton } from '../components/LoadingSkeleton';

/**
 * BoxesPage Component
 * Lists all available boxes
 */
const BoxesPage = () => {
    const {
        items: boxes,
        isLoading,
        hasNextPage,
        isFetchingNextPage,
        fetchNextPage,
        sentinelRef,
    } = useInfinitePagination({
        queryKey: ['boxes'],
        sort: ['name,asc'],
        fetchPage: (page, size, sort) => getBoxes(page, size, sort),
    });

    return (
        <div className="container-content py-8">
            <h1 className="text-2xl font-bold text-text-primary mb-6">All Boxes</h1>

            <div className="space-y-4">
                {isLoading ? (
                    [...Array(3)].map((_, i) => <BoxCardSkeleton key={i} />)
                ) : boxes?.length > 0 ? (
                    <>
                        {boxes.map((box) => (
                            <BoxCard key={box.id} box={box} />
                        ))}
                        <div ref={sentinelRef} className="py-4 text-center text-text-secondary min-h-[1px]">
                            {isFetchingNextPage ? 'Loading more...' : ''}
                        </div>
                    </>
                ) : (
                    <div className="text-center py-8 text-text-secondary">No boxes found</div>
                )}
            </div>
        </div>
    );
};

export default BoxesPage;
