export default function ReaderLoading() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 animate-pulse mt-16">
      {/* Title skeleton */}
      <div className="h-12 w-3/4 bg-gray-200 rounded-md mx-auto mb-16"></div>
      
      {/* Content blocks skeleton */}
      <div className="space-y-8 flex flex-col items-end">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="w-full space-y-4 flex flex-col items-end">
            <div className="h-6 w-full bg-gray-200 rounded"></div>
            <div className="h-6 w-11/12 bg-gray-200 rounded"></div>
            <div className="h-6 w-full bg-gray-200 rounded"></div>
            <div className="h-6 w-4/5 bg-gray-200 rounded"></div>
            <div className="h-6 w-full bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    </div>
  );
}
