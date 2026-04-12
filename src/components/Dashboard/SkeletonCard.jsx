export function SkeletonCard({ large = false }) {
  return (
    <div className={`glass-card p-5 ${large ? 'col-span-2' : ''} animate-pulse`}>
      {/* Image placeholder */}
      {large && <div className="skeleton w-full h-48 mb-4" />}
      {/* Badge */}
      <div className="skeleton h-5 w-20 rounded-full mb-3" />
      {/* Title */}
      <div className="skeleton h-5 w-full mb-2" />
      <div className="skeleton h-5 w-3/4 mb-4" />
      {/* Summary */}
      <div className="skeleton h-3.5 w-full mb-2" />
      <div className="skeleton h-3.5 w-5/6 mb-5" />
      {/* Footer */}
      <div className="flex justify-between items-center pt-3 border-t border-border/50">
        <div className="skeleton h-3 w-24" />
        <div className="skeleton h-3 w-16" />
      </div>
    </div>
  );
}

export function SkeletonGrid({ count = 6 }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {Array.from({ length: count }, (_, i) => (
        <SkeletonCard key={i} large={i === 0} />
      ))}
    </div>
  );
}
