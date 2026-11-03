const LoadingSkeleton = () => {
  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
      {[...Array(9)].map((_, index) => (
        <div
          key={index}
          className="animate-pulse rounded-2xl overflow-hidden border border-neutral-200"
        >
          <div className="h-56 bg-neutral-200" />
          <div className="p-5 space-y-4">
            <div className="h-6 w-3/4 bg-neutral-200 rounded" />
            <div className="h-4 w-1/2 bg-neutral-200 rounded" />
            <div className="h-4 w-full bg-neutral-200 rounded" />
            <div className="h-4 w-5/6 bg-neutral-200 rounded" />
            <div className="h-10 w-full bg-neutral-200 rounded-xl" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default LoadingSkeleton;
