export default function LibraryLoading() {
  return (
    <div className="animate-pulse">
      <div className="h-10 w-64 bg-gray-200 rounded-md mb-8"></div>
      
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:w-1/4">
          <div className="h-96 w-full bg-gray-200 rounded-xl mb-4"></div>
          <div className="h-64 w-full bg-gray-200 rounded-xl"></div>
        </div>
        
        <div className="w-full lg:w-3/4">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white border border-gray-100 rounded-xl p-4 flex flex-col h-[400px]">
                <div className="w-full h-[220px] bg-gray-200 rounded-lg mb-4"></div>
                <div className="h-6 w-3/4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 w-1/2 bg-gray-200 rounded mb-4"></div>
                <div className="mt-auto h-4 w-1/4 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
