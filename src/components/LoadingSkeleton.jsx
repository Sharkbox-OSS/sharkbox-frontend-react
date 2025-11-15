/**
 * LoadingSkeleton Component
 * Modern skeleton loaders for better UX during data fetching
 */

const SkeletonBar = ({ className = '' }) => (
  <div className={`animate-pulse bg-bg-tertiary rounded ${className}`} />
);

export const ThreadCardSkeleton = () => {
  return (
    <div className="card mb-2 flex overflow-hidden">
      <div className="bg-bg-tertiary p-2 flex flex-col items-center min-w-[3rem]">
        <SkeletonBar className="w-6 h-8 mb-1" />
        <SkeletonBar className="w-4 h-4 mb-1" />
        <SkeletonBar className="w-6 h-8" />
      </div>
      <div className="flex-1 p-3">
        <SkeletonBar className="h-3 w-48 mb-2" />
        <SkeletonBar className="h-6 w-full mb-2" />
        <SkeletonBar className="h-4 w-full mb-1" />
        <SkeletonBar className="h-4 w-3/4 mb-3" />
        <SkeletonBar className="h-3 w-24" />
      </div>
    </div>
  );
};

export const BoxCardSkeleton = () => {
  return (
    <div className="card card-hover mb-4 p-4">
      <div className="flex justify-between items-center mb-2">
        <SkeletonBar className="h-5 w-24" />
        <SkeletonBar className="h-5 w-16 rounded" />
      </div>
      <SkeletonBar className="h-6 w-3/4 mb-2" />
      <SkeletonBar className="h-4 w-full mb-1" />
      <SkeletonBar className="h-4 w-5/6 mb-3" />
      <div className="flex justify-between mt-3 pt-3 border-t border-border">
        <SkeletonBar className="h-3 w-20" />
        <SkeletonBar className="h-3 w-24" />
      </div>
    </div>
  );
};

export const CommentSkeleton = () => {
  return (
    <div className="flex gap-2 py-1 mb-1">
      <div className="flex flex-col items-center min-w-[2rem] pt-1 gap-1">
        <SkeletonBar className="w-5 h-5 rounded-full" />
        <SkeletonBar className="w-6 h-3" />
        <SkeletonBar className="w-5 h-5 rounded-full" />
      </div>
      <div className="flex-1 min-w-0">
        <SkeletonBar className="h-3 w-32 mb-1" />
        <SkeletonBar className="h-4 w-full mb-1" />
        <SkeletonBar className="h-4 w-5/6 mb-1" />
        <SkeletonBar className="h-3 w-16" />
      </div>
    </div>
  );
};

export const PageSkeleton = () => {
  return (
    <div className="container-content">
      <SkeletonBar className="h-8 w-48 mb-6" />
      <SkeletonBar className="h-4 w-full mb-2" />
      <SkeletonBar className="h-4 w-5/6" />
    </div>
  );
};
