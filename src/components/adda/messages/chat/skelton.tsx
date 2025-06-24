export const SkeletonLoader = () => (
    <div className="animate-pulse">
      <div className="flex justify-between items-center mb-6 px-2 pb-4 border-b border-gray-100">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
          <div className="flex flex-col">
            <div className="w-24 h-4 bg-gray-200 rounded"></div>
            <div className="w-16 h-3 bg-gray-200 rounded mt-2"></div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
          <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto px-2 py-4 space-y-4">
        {[...Array(3)].map((_, index) => (
          <div key={index} className="flex justify-start mb-4">
            <div className="max-w-xs bg-gray-200 rounded-2xl p-4">
              <div className="w-32 h-4 bg-gray-300 rounded"></div>
              <div className="w-16 h-3 bg-gray-300 rounded mt-2"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );